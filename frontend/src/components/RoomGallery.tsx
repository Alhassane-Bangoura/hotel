import Image from 'next/image';
import { Zap } from 'lucide-react';

interface RoomGalleryProps {
    images: string[];
    remaining: number;
}

export function RoomGallery({ images, remaining }: RoomGalleryProps) {
    // We use the images provided or falls back to placeholders if array is short
    const mainImage = images[0] || '/room_suite_diplomatique_1772792992712.png';
    const thumb1 = images[1] || '/room_standard_1772793062441.png';
    const thumb2 = images[2] || '/room_executive_1772793107544.png';

    return (
        <section className="mb-10">
            <div className="grid grid-cols-12 gap-4 h-[300px] md:h-[500px]">
                {/* Main Hero Image */}
                <div className="col-span-12 lg:col-span-8 relative rounded-2xl overflow-hidden group shadow-lg">
                    <Image
                        src={mainImage}
                        alt="Room main view"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Urgency Badge */}
                    <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl animate-pulse z-10">
                        <Zap className="h-4 w-4 fill-current" />
                        Il reste {remaining} chambres
                    </div>
                    {/* Counter */}
                    <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-xs font-bold z-10 border border-white/10 uppercase tracking-widest leading-none">
                        1 / {images.length || 5} Photos
                    </div>
                </div>

                {/* Thumbnails */}
                <div className="hidden lg:grid col-span-4 grid-rows-2 gap-4">
                    <div className="relative rounded-2xl overflow-hidden shadow-md group">
                        <Image src={thumb1} alt="Room detail 1" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-md group">
                        <Image src={thumb2} alt="Room detail 2" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-all font-black text-white text-lg">
                            +{Math.max(0, images.length - 3)} Photos
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
