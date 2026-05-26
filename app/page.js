import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="navbar px-10">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">
            Interior AI
          </h1>
        </div>

        <div className="flex-none">
          <Link href="/dashboard">
            <button className="btn btn-primary">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      <section className="flex flex-col items-center text-center px-6 mt-16">
        <h2 className="text-5xl font-bold max-w-4xl">
          AI Room & Interior Design
        </h2>

        <p className="mt-5 text-gray-500 max-w-2xl">
          Transform your room with AI. Upload your room image, choose a room type
          and design style, then generate a redesigned interior image.
        </p>

        <Link href="/dashboard">
          <button className="btn btn-primary mt-8">
            Get Started
          </button>
        </Link>

        <div className="mt-12">
          <Image
            src="/group.png"
            alt="Interior AI preview"
            width={900}
            height={500}
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>
    </div>
  )
}