
type contentType ={
    username:string;
    link:string;

}

export const generateWelcomeEmail= (content:contentType): string => {
    return`
    <div style="text-align: center; border: 2px solid #C4C4C4; width: 100%; margin: auto; border-radius: 10px;">
<img style="margin-top:30px; height: 50px;" src="https://res.cloudinary.com/salvi/image/upload/v1645430695/xomozztbcyyp4imkq6wy.jpg" />
<h3 style="margin-top: 30px;">Welcome to HealthEdu ${content.username}</h3>

<div style=" width: 80%; margin: auto; margin-top: 10px; text-align: center;">
    
    
    <p style="margin-top: 20px; margin-bottom: 40px;">
    <p>Your account have been created successfully! Welcome aboard. To continue we will need to verify if it is you. pleasee click the button below to verify it is you.<b> Please Ignore this message if you haven't created an account to healtheducat.rw!</b></p>
</p>
<a href="${content.link}" target= "_blank">
    <button style="background-color:#1c9e1b;color: #ffffff;transition: all 150ms ease-in-out;line-height: 1;border: none; height: 40px; border-radius: 5px;padding:10px" 
    href="${content.link}">Verify account</button>
    </a>
    <p> If you are having trouble with the button use the link below <br style="font-size: 15px;">${content.link}</br> </p>
    </p>
</div>
</div>
    `
}

export const generateResetPasswordEmail= (content:contentType): string => {
    return`
    <div style="text-align: center; border: 2px solid #C4C4C4; width: 100%; margin: auto; border-radius: 10px;">
<img style="margin-top:30px; height: 50px;" src="https://res.cloudinary.com/salvi/image/upload/v1645430695/xomozztbcyyp4imkq6wy.jpg" />
<h2 style="margin-top: 30px;">Hello ${content.username}</h2>

<div style=" width: 80%; margin: auto; margin-top: 10px; text-align: center">
    
    
    <p style="margin-top: 20px; margin-bottom: 40px;">
Your password have been changed successfully! <b style="font-size: 15px;"></b>
        
        
    </p>
</div>
</div>
    `
}
export const generateForgetPasswordEmail= (content:contentType): string => {
    return`

<div style="text-align: center; border: 2px solid #C4C4C4; width: 100%; margin: auto; border-radius: 10px;">
<img style="margin-top:30px; height: 50px;" src="https://res.cloudinary.com/salvi/image/upload/v1645430695/xomozztbcyyp4imkq6wy.jpg" />
<h2 style="margin-top: 30px;">Hi  ${content.username}</h2>

<div style=" width: 70%; margin: auto; margin-top: 20px; text-align: center;">
    
    
    <p style="margin-top: 20px; margin-bottom: 70px;">
<p>Due to your request to change password please click the button below to do so. <b> Please Ignore this message if you haven't requested to do so!</b></p>


        
        
    </p>
    <a href="${content.link}" target= "_blank">
    <button style="background-color:#1c9e1b;color: #ffffff;transition: all 150ms ease-in-out;line-height: 1;border: none; height: 40px; border-radius: 5px;padding:10px" 
    href="${content.link}">Change your password</button>
    </a>
    <p> If you are having trouble with the button use the link below <b style="font-size: 15px;">${content.link}</b> </p>
</div>
</div>
    `
}
