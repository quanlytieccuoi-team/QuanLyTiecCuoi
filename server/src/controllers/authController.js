const LoginUserUseCase = require('../usecases/loginUser');
const RegisterUserUseCase = require('../usecases/registerUser');
const SqlUserRepository = require('../infrastructure/sqlUserRepo');

// Initialize repositories and use cases
const userRepository = new SqlUserRepository();
const loginUserUseCase = new LoginUserUseCase(userRepository);
const registerUserUseCase = new RegisterUserUseCase(userRepository);

/**
 * Controller for authentication-related endpoints
 */
class AuthController {
  /**
   * Login a user
   */
  async login(req, res) {
    try {
      console.log('Login request received:', { email: req.body.email });
      
      if (!req.body.email || !req.body.password) {
        console.error('Login failed: Missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
      
      const { email, password } = req.body;
      const result = await loginUserUseCase.execute(email, password);
      
      if (!result.success) {
        console.log('Login failed:', result.message);
        return res.status(401).json(result);
      }
      
      console.log('Login successful for user:', result.user.email);
      res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      console.log('Registration request received:', { 
        email: req.body.email,
        name: req.body.name
      });
      
      if (!req.body.name || !req.body.email || !req.body.password) {
        console.error('Registration failed: Missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }
      
      const { name, email, password } = req.body;
      const result = await registerUserUseCase.execute({ name, email, password });
      
      if (!result.success) {
        console.log('Registration failed:', result.message);
        return res.status(400).json(result);
      }
      
      console.log('Registration successful for user:', result.user.email);
      res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new AuthController(); 