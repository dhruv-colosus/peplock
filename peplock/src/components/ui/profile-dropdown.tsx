import { User, LogOut, Settings } from "lucide-react"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"

export function ProfileDropdown() {
    return (
        <Menubar className="border-0 bg-transparent">
            <MenubarMenu>
                <MenubarTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white rounded-xl h-9 w-9 bg-white/10">
                        <User className="h-4 w-4" />
                    </Button>
                </MenubarTrigger>
                <MenubarContent align="end" className="bg-black/90 backdrop-blur-lg border-white/10">
                    <MenubarItem className="text-white/60 focus:text-white cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                    </MenubarItem>
                    <MenubarSeparator className="bg-white/10" />
                    <MenubarItem className="text-white/60 focus:text-white cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
} 