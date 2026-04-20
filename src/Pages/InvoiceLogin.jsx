import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authAPI } from '../services/api';

const InvoiceLogin = () => {
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!formData.username || !formData.password) {
			Swal.fire('Error', 'Please enter both username and password', 'error');
			return;
		}

		setIsLoading(true);
		try {
			console.log('Attempting login with:', { username: formData.username });
			const response = await authAPI.login(formData.username, formData.password);
			console.log('Login response:', response);
			
			// Store token in localStorage
			localStorage.setItem('token', response.token);
			localStorage.setItem('adminName', response.admin.username);
			
			Swal.fire({
				title: 'Success!',
				text: `Welcome back, ${response.admin.username}!`,
				icon: 'success',
				timer: 1500,
				showConfirmButton: false
			});
			
			// Redirect to invoice management
		setTimeout(() => navigate('/management/invoices'), 1500);
		} catch (error) {
			console.error('Login error:', error);
			Swal.fire('Login Failed', error.message || 'Invalid credentials', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSubmit(e);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-[#0097A7] to-[#00BCD4] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full'>
				<div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
					{/* Logo/Header */}
					<div className='text-center'>
						<div className='mx-auto h-16 w-16 bg-[#0097A7] rounded-full flex items-center justify-center mb-4'>
						<i className='fas fa-users-cog text-white text-3xl'></i>
					</div>
					<h2 className='text-3xl font-bold text-gray-900'>
						Management Dashboard
					</h2>
					<p className='mt-2 text-sm text-gray-600'>
						Admin Access Portal
						</p>
					</div>

					{/* Login Form */}
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Username Field */}
						<div>
							<label htmlFor='username' className='block text-sm font-semibold text-gray-700 mb-2'>
								Username
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<i className='fas fa-user text-gray-400'></i>
								</div>
								<input
									id='username'
									name='username'
									type='text'
									autoComplete='username'
									required
									value={formData.username}
									onChange={handleChange}
									onKeyPress={handleKeyPress}
									disabled={isLoading}
									className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097A7] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors'
									placeholder='Enter your username'
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<i className='fas fa-lock text-gray-400'></i>
								</div>
								<input
									id='password'
									name='password'
									type={showPassword ? 'text' : 'password'}
									autoComplete='current-password'
									required
									value={formData.password}
									onChange={handleChange}
									onKeyPress={handleKeyPress}
									disabled={isLoading}
									className='block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097A7] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors'
									placeholder='Enter your password'
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute inset-y-0 right-0 pr-3 flex items-center'
									disabled={isLoading}>
									<i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600 cursor-pointer`}></i>
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<div>
							<button
								type='submit'
								disabled={isLoading}
								className='w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#0097A7] hover:bg-[#007A87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097A7] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg'>
								{isLoading ? (
									<>
										<i className='fas fa-spinner fa-spin mr-2'></i>
										Logging in...
									</>
								) : (
									<>
										<i className='fas fa-sign-in-alt mr-2'></i>
										Sign In
									</>
								)}
							</button>
						</div>
					</form>

					{/* Footer */}
					<div className='text-center'>
						<p className='text-xs text-gray-500'>
							<i className='fas fa-shield-alt mr-1'></i>
							Secure Login - 833PROBAID
						</p>
					</div>
				</div>

				{/* Info Card */}
				<div className='mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center'>
					<p className='text-sm'>
						<i className='fas fa-info-circle mr-1'></i>
						First time? Contact administrator for credentials
					</p>
				</div>
			</div>
		</div>
	);
};

export default InvoiceLogin;
