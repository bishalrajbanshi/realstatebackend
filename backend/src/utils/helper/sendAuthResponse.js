

const sendAuthResponse = (res, accessToken, refreshToken) => {
    res.status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true, 
        secure: true, 
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: true,    
        path: '/auth/refresh', 
          })
      .json({
        success: true,
        message: 'Google login successful',
        data: { accessToken,refreshToken },  
      });
  };
  
  export { sendAuthResponse };
  