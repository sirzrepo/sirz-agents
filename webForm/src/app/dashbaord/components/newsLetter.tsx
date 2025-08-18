"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export default function NewsLetter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscribe = useMutation(api.resources.newsLetter.subscribe);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.")
      return
    }
    setLoading(true)
    try {
      const res = await subscribe({ email })
      if (!res) throw new Error("Subscription failed")
      setSuccess(true)
      setEmail("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden border-t bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 md:py-24">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Ready to trade with confidence?</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Join thousands of buyers and sellers using Rekobo to close safer deals every day.
          </p>

          <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              aria-label="Email address"
              required
            />
            <Button type="submit" className="h-11 min-w-32 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get early access"}
            </Button>
          </form>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {success ? (
            <p className="mt-3 inline-flex items-center justify-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> You&apos;re on the list! We&apos;ll be in touch soon.
            </p>
          ) : null}

          <p className="mt-6 text-xs text-slate-500">
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  )
}
