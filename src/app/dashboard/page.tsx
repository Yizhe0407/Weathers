"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SquarePlus } from 'lucide-react';
import Choose from "@/components/Choose";
import CountyTownItem from "@/components/CountyTownItem";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface ApiResponse {
    towns: string[]; 
}

export default function Page() {
    const { user } = useUser();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [userTowns, setUserTowns] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const email = user?.emailAddresses?.[0]?.emailAddress;

    const fetchUserTowns = useCallback(async () => {
        try {
            const response = await fetch(`https://weathers-backend.vercel.app/api/data?email=${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data: ApiResponse = await response.json();

                setUserTowns(data.towns);
            } else {
                console.error("Failed to fetch user towns");
            }
        } catch (error) {
            console.error("Error fetching user towns:", error);
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        if (!isSignedIn) {
            router.push("/");
        } else if (email) {
            fetchUserTowns();
        }
    }, [isSignedIn, router, email, fetchUserTowns]);

    const handleDialogClose = () => {
        setOpen(false);
        fetchUserTowns(); // 重新從 API 獲取最新的數據
    };

    const handleTownDelete = (deletedTown: string) => {
        setUserTowns((prevTowns) => prevTowns.filter((town) => town !== deletedTown));
    };

    if (loading) {
        return (
            <DotLottieReact
                src="https://lottie.host/f23863ed-a21e-401f-90ba-8e428d26e5d4/k91uNUTgIt.json"
                loop
                autoplay
            />
        );
    }

    return (
        <div className="p-4 flex flex-col items-center justify-center">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="bg-[#A79277] border-none text-white text-lg hover:bg-[#EAD8C0] w-full max-w-xl flex justify-center items-center space-x-2" // 使用 space-x-2 調整圖示與文本間距
                        onClick={() => setOpen(true)}
                    >
                        <SquarePlus /> 
                        <span>新增</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] w-64 bg-[#D1BB9E] border-none rounded-lg" style={{ top: '35%' }}>
                    <DialogHeader>
                        <DialogTitle>選擇地區</DialogTitle>
                    </DialogHeader>
                    <Choose onSuccess={handleDialogClose} />
                </DialogContent>
            </Dialog>

            <div className="mt-4 grid grid-cols gap-4 w-full max-w-xl">
                {userTowns.map((town, index) => (
                    <CountyTownItem
                        key={`${town}-${index}`} 
                        town={town} 
                        onDelete={handleTownDelete}
                    />
                ))}
            </div>
        </div>
    );
}
