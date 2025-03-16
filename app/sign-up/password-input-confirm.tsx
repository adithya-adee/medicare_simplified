"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface PasswordInputWithConfirmProps {
  onChange?: (password: string, isValid: boolean) => void;
  hasError?: boolean;
}

export default function PasswordInputWithConfirm({ 
  onChange, 
  hasError = false 
}: PasswordInputWithConfirmProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  
  // Check password validity and notify parent component
  useEffect(() => {
    // Only check match if confirmPassword has a value
    const match = !confirmPassword || password === confirmPassword
    if(match){
      setPasswordsMatch(match)
    }
    
    // Notify parent component
    if (onChange) {
      const isValid = password.length >= 8 && match
      onChange(password, isValid)
    }
  }, [password, confirmPassword, onChange])
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Choose a strong password"
          required
          className={`pr-10 ${hasError ? "border-destructive focus-visible:ring-destructive" : ""}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeIcon className="h-4 w-4" />
          ) : (
            <EyeOffIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      
      <div className="relative">
        <Input
          id="confirm-password"
          name="confirm-password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          required
          className={`pr-10 ${!passwordsMatch || hasError ? "border-destructive focus-visible:ring-destructive" : ""}`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          tabIndex={-1}
        >
          {showConfirmPassword ? (
            <EyeIcon className="h-4 w-4" />
          ) : (
            <EyeOffIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {!passwordsMatch && confirmPassword && (
        <p className="text-destructive text-xs">Passwords do not match</p>
      )}
      
      <div className="text-xs text-muted-foreground">
        Password must be at least 8 characters long
      </div>
    </div>
  )
}
