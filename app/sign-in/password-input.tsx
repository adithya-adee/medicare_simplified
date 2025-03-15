"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        required
        className="pr-10"
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
  )
} 