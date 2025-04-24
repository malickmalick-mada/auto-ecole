export function LoadingSpinner() {
  return (
    <div className="absolute top-10 p-6 w-full flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-[#ffa45c]" />
    </div>
  )
}