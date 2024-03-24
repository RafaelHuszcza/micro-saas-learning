'use client'
import { Github, LoaderCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { GoogleIcon } from '@/components/google'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { KeyCloakForm } from './keycloak-form'
import { MagicLinkForm } from './magic-link-form'

export function AuthForm() {
  const [submittingGithub, setSubmittingGithub] = useState(false)
  const [submittingGoogle, setSubmittingGoogle] = useState(false)
  const [magicLinkView, setMagicLinkView] = useState(false)
  const [keyCloakView, setKeyCloakView] = useState(false)
  const t = useTranslations('auth.components.auth-form')
  const handleGithubSignIn = async () => {
    try {
      setSubmittingGithub(true)
      await signIn('github')
      setSubmittingGithub(false)
    } catch (error) {
      setSubmittingGithub(false)
    }
  }
  const handleGoogleSignIn = async () => {
    try {
      setSubmittingGoogle(true)
      await signIn('google')
      setSubmittingGoogle(false)
    } catch (error) {
      setSubmittingGoogle(false)
    }
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleGithubSignIn}
            disabled={submittingGithub}
          >
            {submittingGithub ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                {t('github')}
              </div>
            )}
          </Button>
          <Button
            disabled={submittingGoogle}
            className="w-full"
            variant="outline"
            onClick={handleGoogleSignIn}
          >
            <div className="flex items-center gap-2">
              <GoogleIcon className="h-4 w-4" />
              {t('google')}
            </div>
          </Button>
        </div>
        <Separator className="my-8 " />
        <div className="space-y-4">
          {!magicLinkView && (
            <Button
              className="w-full"
              onClick={() => setMagicLinkView((prev) => !prev)}
            >
              {t('email')}
            </Button>
          )}
          {magicLinkView && <MagicLinkForm />}
          {!keyCloakView && (
            <Button
              className="w-full"
              onClick={() => setKeyCloakView((prev) => !prev)}
            >
              {t('email-password')}
            </Button>
          )}
          {keyCloakView && <KeyCloakForm />}
        </div>
      </CardContent>
    </Card>
  )
}
