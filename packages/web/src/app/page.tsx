import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">VIRGIO PLM System</h1>
        <p className="text-lg text-gray-600">Product Lifecycle Management - Phase 1</p>
      </div>
      <p className="mb-8 text-lg text-gray-700">Choose your role:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
        <Link
          href="/designer"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-center font-semibold text-lg transition shadow-md hover:shadow-lg"
        >
          Designer
        </Link>
        <Link
          href="/tech-spec"
          className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-center font-semibold text-lg transition shadow-md hover:shadow-lg"
        >
          Tech Spec
        </Link>
        <Link
          href="/pattern-master"
          className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 text-center font-semibold text-lg transition shadow-md hover:shadow-lg"
        >
          Pattern Master
        </Link>
        <Link
          href="/sourcing"
          className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 text-center font-semibold text-lg transition shadow-md hover:shadow-lg"
        >
          Sourcing
        </Link>
      </div>
    </main>
  )
}

