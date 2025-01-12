import React from 'react'

interface PasswordStrengthIndicatorProps { 
password:string
}
const getPasswordStrength = (password:string)=> {
    if(password.length < 6)  return 'weak';
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^a-zA-Z0-9]/.test(password)
    if(hasLower && hasUpper && hasNumber && hasSpecial) return 'strong';
    if((hasLower || hasUpper)&&hasNumber) return 'normal'
    return 'weak'
}
const PasswordStrengthIndicator:React.FC<PasswordStrengthIndicatorProps> = ({password}) => {
const strength = getPasswordStrength(password)
const getColor = ()=> {
    switch(strength) {
        case 'strong': 
        return 'bg-green-500';
        case 'normal':
            return 'bg-orange-500';
        case 'weak':
            default: return 'bg-red-500';
    }
}
return (
    <div className={`w-3 h-3 rounded-full ${getColor()} absolute right-10 top-12 transform -translate-y-1/2`} />
  );
}

export default PasswordStrengthIndicator