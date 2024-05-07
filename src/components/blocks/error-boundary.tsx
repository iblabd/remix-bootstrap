import {
  Link,
  Meta,
  Scripts,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react'
import { createElement } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorStack } from '@/components/blocks/error-stack'
import { getEnvValue } from '@/lib/utils'

type ErrorBoundaryLayoutProps = {
  status?: number
  statusText: string
  message: string
  actionButton?: JSX.Element
}

function ErrorBoundaryLayout({
  status,
  statusText,
  message,
  actionButton,
}: ErrorBoundaryLayoutProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex flex-col items-center justify-center">
          {status && (
            <h3 className="select-none text-[140px] font-bold text-accent">
              {status}
            </h3>
          )}
          <span className="-mt-12 text-2xl font-bold text-foreground">
            {statusText}
          </span>
        </div>
        <span className="max-w-md text-center text-muted-foreground">
          {message}
        </span>
        {actionButton}
      </div>
    </div>
  )
}

export function ErrorBoundaryBlock({ isClient }: { isClient: boolean }) {
  const error = useRouteError()
  const appName = getEnvValue('VITE_APP_NAME')

  if (isClient) {
    return createElement('html', {
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: document.getElementsByTagName('html')[0].innerHTML,
      },
    })
  }

  if (isRouteErrorResponse(error)) {
    const { status, statusText } = error
    const pageTitle = `Oops! ${statusText} - ${appName}`
    const messages: { [key: number]: string } = {
      400: 'Something went wrong with your request. Please check your input and try again.',
      401: 'You need to log in or provide valid credentials to access this resource.',
      403: "You don't have permission to access this resource. Please contact the administrator.",
      404: 'The page you were looking for could not be found.',
    }
    const message = messages[status] || 'An error occurred. Please try again.'
    const actionButtons: { [key: number]: JSX.Element } = {
      401: (
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      ),
      404: (
        <Button asChild>
          <Link to="/">Take me back</Link>
        </Button>
      ),
    }
    const actionButton = actionButtons[status]

    return (
      <html lang="en">
        <head>
          <title>{pageTitle}</title>
          <Meta />
        </head>
        <body>
          <ErrorBoundaryLayout
            status={status}
            statusText={statusText}
            message={message}
            actionButton={actionButton}
          />
          <Scripts />
        </body>
      </html>
    )
  }

  const { message, stack } = error as Error

  return (
    <html lang="en">
      <head>
        <title>Something went wrong - {appName}</title>
        <Meta />
      </head>
      <body>
        {getEnvValue('PROD') ? (
          <ErrorBoundaryLayout
            statusText={message || 'App Error'}
            message="An error has occurred processing your request. You may try
          again or contact support if the problem persists."
            actionButton={
              <Button asChild>
                <Link to="/">Take me back</Link>
              </Button>
            }
          />
        ) : (
          <ErrorStack
            message={message}
            stack={stack}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
