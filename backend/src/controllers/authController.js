const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendVerificationEmail = async (user) => {
  const verificationURL = `${process.env.FRONTEND_URL}/verify-email/${user.verificationToken}`;

  const message = `Please verify your email by clicking on this link: ${verificationURL}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to AI Trading Platform</h2>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationURL}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link in your browser:</p>
      <p>${verificationURL}</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Verify your email',
    message,
    html,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
      });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    await sendVerificationEmail(user);

    // Generate JWT token
    const token = signToken(user._id);

    // Remove sensitive data from response
    user.password = undefined;
    user.passwordConfirm = undefined;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    res.status(201).json({
      status: 'success',
      message: 'Verification email sent. Please check your inbox.',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already verified',
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Update user with new token without modifying password
    await User.findByIdAndUpdate(
      user._id,
      {
        verificationToken,
        verificationTokenExpires,
      },
      { runValidators: false } // Disable validation for this update
    );

    // Send verification email
    await sendVerificationEmail({
      ...user.toObject(),
      verificationToken,
      verificationTokenExpires,
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        status: 'error',
        message: 'Please verify your email first',
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    };

    // Set cookie
    res.cookie('token', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login',
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with the verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token',
      });
    }

    // Update user without requiring password confirmation
    await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        verificationToken: undefined,
        verificationTokenExpires: undefined,
      },
      { runValidators: false }
    );

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error verifying email',
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.logout = (req, res) => {
  try {
    // Clear the token cookie with proper options
    const cookieOptions = {
      expires: new Date(0), // Set to past date to ensure deletion
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      domain:
        process.env.NODE_ENV === 'production'
          ? '.ai-trading-lac.vercel.app'
          : undefined,
    };

    // Clear both token and any other auth-related cookies
    res.clearCookie('token', cookieOptions);
    res.clearCookie('connect.sid', cookieOptions);

    // Send response before redirect
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during logout',
    });
  }
};
