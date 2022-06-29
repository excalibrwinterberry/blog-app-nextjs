import Link from "next/link"
function Header() {
  return (
    <header >
        <div className="flex items-center space-x-5">
            <Link href="/">
                <img className="w-44 object-contain cursor-pointer" src="https://i.postimg.cc/HsN3V2VG/Screenshot-2022-06-29-at-10-34-36-AM.png" alt=""/>
            </Link>
            <div className="hidden md:inline-flex items-center space-x-5">
                <h3>About</h3>
                <h3>Contact</h3>
                <h3 className="text-white bg-gray-600 px-4 py-1 rounded-full">Follow</h3>
            </div>

        </div>
    </header>
  )
}

export default Header