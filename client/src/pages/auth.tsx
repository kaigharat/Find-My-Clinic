import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail, Chrome } from "lucide-react";

export default function Auth() {
  const { t } = useTranslation();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [authMethod, setAuthMethod] = useState<'google' | 'email' | null>(null);

  // Redirect if already logged in
  if (user) {
    setLocation('/home');
    return null;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      // Redirect will be handled by the dashboard routing
      setLocation('/home');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      setLoading(false);
      return;
    }

    const { data, error } = await signUp(email, password, name);

    if (error) {
      setError(error.message);
    } else {
      if (data?.user && !data.user.email_confirmed_at) {
        setError(t('auth.checkEmailConfirmation'));
      } else {
        setLocation('/home');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('auth.title')}</CardTitle>
          <CardDescription>
            {t('auth.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Auth Method Selection */}
          {!authMethod && (
            <div className="space-y-6 mb-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('auth.chooseMethod')}</Label>
                <Button
                  onClick={() => setAuthMethod('google')}
                  variant="outline"
                  className="w-full h-12"
                  disabled={loading}
                >
                  <Chrome className="mr-2 h-5 w-5" />
                  {t('auth.continueWithGoogle')}
                </Button>

                <Button
                  onClick={() => setAuthMethod('email')}
                  variant="outline"
                  className="w-full h-12"
                  disabled={loading}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  {t('auth.continueWithEmail')}
                </Button>
              </div>
            </div>
          )}

          {/* Auth Method Specific UI */}
          {authMethod === 'google' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">{t('auth.signInAsPatient')}</h3>
                <p className="text-sm text-muted-foreground">{t('auth.usingGoogle')}</p>
              </div>
              <Button
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  // Store user type in localStorage for post-auth processing
                  localStorage.setItem('pendingUserType', 'patient');
                  const { error } = await signInWithGoogle();
                  if (error) {
                    setError(error.message);
                    setLoading(false);
                  }
                }}
                className="w-full h-12"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Chrome className="mr-2 h-5 w-5" />
                {t('auth.continueWithGoogle')}
              </Button>
              <Button
                onClick={() => setAuthMethod(null)}
                variant="ghost"
                className="w-full"
              >
                {t('auth.backToOptions')}
              </Button>
            </div>
          )}



          {authMethod === 'email' && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('auth.continueWithEmailAsPatient')}
                  </span>
                </div>
              </div>

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
                  <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">{t('auth.email')}</Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder={t('auth.enterEmail')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">{t('auth.password')}</Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder={t('auth.enterPassword')}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('auth.signIn')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">{t('auth.name')}</Label>
                      <Input
                        id="signup-name"
                        name="name"
                        type="text"
                        placeholder={t('auth.enterName')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{t('auth.email')}</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder={t('auth.enterEmail')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{t('auth.password')}</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder={t('auth.createPassword')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">{t('auth.confirmPassword')}</Label>
                      <Input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder={t('auth.confirmYourPassword')}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant={error === 'Check your email for the confirmation link!' ? 'default' : 'destructive'}>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('auth.signUpAsPatient')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <Button
                onClick={() => setAuthMethod(null)}
                variant="ghost"
                className="w-full"
              >
                {t('auth.backToOptions')}
              </Button>
            </>
          )}




        </CardContent>
      </Card>
    </div>
  );
}
