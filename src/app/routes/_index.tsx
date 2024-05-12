import type { MetaFunction } from '@remix-run/node'
import Header from '@/components/blocks/header'
import { getEnvValue } from '@/lib/utils'
import Hero from '@/components/blocks/hero'

export const meta: MetaFunction = () => {
  return [
    { title: getEnvValue('VITE_APP_NAME') },
    {
      name: 'description',
      content: `Welcome to ${getEnvValue('VITE_APP_NAME')}!`,
    },
  ]
}

export default function Index() {
  return (
    <>
    <div className="flex justify-center">
      <Header
        navLinks={[
          {
            title: 'Pricing',
            to: '#about',
          },
          {
            title: 'Features',
            to: '#features',
          },
          {
            title: 'FAQ',
            to: '#faq',
          },
        ]}
        actionButton={{
          title: 'Get Started',
          to: '/register',
        }}
      />
    </div>
      <Hero />
    </>
  )
}
