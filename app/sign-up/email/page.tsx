"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PasswordInputWithConfirm from "../password-input-confirm"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Customer, User } from "@/type/interface"

// Add a type for the form data
interface FormData {
  name: string;
  address: string;
  phone_no: string;
  pincode: string;
  age: string;
  gender: string;
  email: string;
  password: string;
  auth_type: string;
}

export default function EmailSignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    phone_no: "",
    pincode: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    auth_type: "email"
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Required fields
    const requiredFields: Array<keyof FormData> = ["name", "address", "phone_no", "pincode", "age", "gender", "email", "password"]
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required"
      }
    })
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    // Phone validation
    if (formData.phone_no && !/^\d{10}$/.test(formData.phone_no)) {
      newErrors.phone_no = "Phone number must be 10 digits"
    }
    
    // Pincode validation
    const pincode = Number(formData.pincode)
    if (formData.pincode && (isNaN(pincode) || pincode < 100001 || pincode > 999998)) {
      newErrors.pincode = "Pincode must be between 100001 and 999998"
    }
    
    // Age validation
    const age = Number(formData.age)
    if (formData.age && (isNaN(age) || age < 1 || age > 149)) {
      newErrors.age = "Age must be between 1 and 149"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          doctor_id: null // Assuming doctor_id is optional and not provided in email sign-up
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Registration successful")
        // Redirect to sign-in page after successful registration
        setTimeout(() => {
          router.push("/sign-in")
        }, 2000)
      } else {
        toast.error(data.message || "Registration failed")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An error occurred during registration")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Toaster position="top-center" />
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up with Email</CardTitle>
          <CardDescription className="text-center">
            Please fill in your details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone_no">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone_no"
                    value={formData.phone_no}
                    onChange={(e) => handleChange("phone_no", e.target.value)}
                    placeholder="1234567890"
                    className={errors.phone_no ? "border-destructive" : ""}
                  />
                  {errors.phone_no && <p className="text-destructive text-xs">{errors.phone_no}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">
                  Address <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter your full address"
                  className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.address ? "border-destructive" : ""}`}
                />
                {errors.address && <p className="text-destructive text-xs">{errors.address}</p>}
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="pincode">
                    Pincode <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pincode"
                    type="number"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    placeholder="123456"
                    className={errors.pincode ? "border-destructive" : ""}
                  />
                  {errors.pincode && <p className="text-destructive text-xs">{errors.pincode}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="25"
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && <p className="text-destructive text-xs">{errors.age}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleChange("gender", value)}
                  >
                    <SelectTrigger id="gender" className={errors.gender ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-destructive text-xs">{errors.gender}</p>}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Account Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <PasswordInputWithConfirm 
                  onChange={(value) => handleChange("password", value)}
                  hasError={!!errors.password}
                />
                {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
