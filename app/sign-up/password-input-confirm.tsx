"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function PasswordInputWithConfirm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  
  // Check if passwords match whenever either password changes
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(true)
    }
  }, [password, confirmPassword])
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Choose a strong password"
          required
          className="pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowPassword(!showPassword)}
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
          className={`pr-10 ${!passwordsMatch ? "border-destructive focus-visible:ring-destructive" : ""}`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <EyeIcon className="h-4 w-4" />
          ) : (
            <EyeOffIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {!passwordsMatch && (
        <p className="text-destructive text-xs">Passwords do not match</p>
      )}
      
      <div className="text-xs text-muted-foreground">
        Password must be at least 8 characters long
      </div>
    </div>
  )
} 