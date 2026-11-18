import { cn } from '@/lib/utils';

interface LocationMapProps {
    className?: string;
}

const LocationMap = ({ className }: LocationMapProps) => {
    // URL to open when the map is clicked (opens in new tab)
    const mapUrl = "https://www.google.com/maps/place/United+Bible+Societies/@-1.296862,36.774452,17z/data=!3m1!4b1!4m6!3m5!1s0x182f1a74a1656165:0xdbc32224ee89f89c!8m2!3d-1.296862!4d36.776641!16s%2Fg%2F11b6g_6z_0";

    return (
        <div className={cn("relative w-full h-full min-h-[300px] rounded-xl overflow-hidden shadow-md group", className)}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.796329812343!2d36.77445247399224!3d-1.296862035635728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a74a1656165%3A0xdbc32224ee89f89c!2sUnited%20Bible%20Societies!5e0!3m2!1sen!2ske!4v1765968988045!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
                title="Google Map Location"
            />

            {/* Clickable overlay to open map in new tab */}
            <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                aria-label="Open location in Google Maps"
            />
        </div>
    );
};

export default LocationMap;
