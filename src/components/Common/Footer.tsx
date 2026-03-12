import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Travel Handmade</h3>
            <p className="text-sm">Inspiring conscious travel and authentic experiences worldwide.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-orange-500">Travel + Living</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Adventure</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Food + Drinks</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Wellness</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-orange-500">About Us</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Contact</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Privacy</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-orange-500">Facebook</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Instagram</Link></li>
              <li><Link href="#" className="hover:text-orange-500">Twitter</Link></li>
              <li><Link href="#" className="hover:text-orange-500">YouTube</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2024 Travel Handmade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
