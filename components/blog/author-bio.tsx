import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Linkedin, Mail, Twitter } from 'lucide-react'
import Link from 'next/link'

interface AuthorBioProps {
    author?: {
        full_name: string
        avatar_url?: string
        bio?: string
        role?: string
    }
}

export function AuthorBio({ author }: AuthorBioProps) {
    // Fallback to SK AutoSphere Official if no specific author
    const name = author?.full_name || 'SK AutoSphere Team'
    const role = author?.role || 'Automotive Import Specialists'
    const avatar = author?.avatar_url || '/placeholder-logo.png' // Adjust fallback path
    const bio = author?.bio || 'We help African dealers source high-quality Korean vehicles directly from verified sellers, ensuring a transparent and secure import process.'

    return (
        <Card className="flex flex-col gap-6 p-8 rounded-xl bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 sm:flex-row sm:items-start">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-[#2558fa] text-white font-bold">SK</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
                    <p className="text-sm font-medium text-[#2558fa]">{role}</p>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {bio}
                </p>

                <div className="flex gap-4 pt-2">
                    <Link href="#" className="text-slate-400 hover:text-[#2558fa] transition-colors">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link href="#" className="text-slate-400 hover:text-[#2558fa] transition-colors">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link href="/contact" className="text-slate-400 hover:text-[#2558fa] transition-colors">
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                    </Link>
                </div>
            </div>
        </Card>
    )
}
