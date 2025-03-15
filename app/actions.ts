'use server'

import { signOut } from "@/auth"

export async function handleSignOutAction() {
  try {
    await signOut()
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false, error: "Failed to sign out" }
  }
} 