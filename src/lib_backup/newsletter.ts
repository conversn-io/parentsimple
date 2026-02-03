import { supabase } from "./supabase"

export interface NewsletterSignup {
  id?: string
  email: string
  created_at?: string
  source?: string
  status?: "active" | "unsubscribed"
}

export async function signUpForNewsletter(email: string, source: string = "website") {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Please enter a valid email address." }
    }

    const { data: existing, error: existingError } = await supabase
      .from("newsletter_signups")
      .select("id, status")
      .eq("email", email)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      console.error("Error checking existing subscription:", existingError)
      throw existingError
    }

    if (existing) {
      if (existing.status === "unsubscribed") {
        const { error } = await supabase
          .from("newsletter_signups")
          .update({
            status: "active",
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id)

        if (error) {
          console.error("Error reactivating subscription:", error)
          throw error
        }
        return { success: true, message: "Welcome back! Your subscription has been reactivated." }
      } else {
        return { success: false, message: "You are already subscribed to our newsletter!" }
      }
    }

    const { error } = await supabase
      .from("newsletter_signups")
      .insert({
        email,
        source,
        status: "active",
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error("Error inserting new subscription:", error)
      throw error
    }

    return { success: true, message: "Thank you for subscribing to our newsletter!" }
  } catch (error) {
    console.error("Newsletter signup error:", error)
    return {
      success: false,
      message: "Sorry, there was an error. Please try again later."
    }
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  try {
    const { error } = await supabase
      .from("newsletter_signups")
      .update({
        status: "unsubscribed",
        updated_at: new Date().toISOString()
      })
      .eq("email", email)

    if (error) throw error

    return { success: true, message: "You have been unsubscribed from our newsletter." }
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    return {
      success: false,
      message: "Sorry, there was an error. Please try again later."
    }
  }
}
