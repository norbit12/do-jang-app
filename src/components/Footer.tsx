import Link from "next/link";

export default function Footer() {
    return (
        <div>
            <p className="text-center text-slate-400 text-sm mb-2">&copy; 2026 <Link href="/" className="underline focus:text-slate-600 outline-none hover:text-slate-600">DoJang</Link>. All rights reserved.</p>
        </div>
    )
}