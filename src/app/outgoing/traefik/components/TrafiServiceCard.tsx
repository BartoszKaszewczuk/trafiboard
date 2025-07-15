'use client';
import {Card, CardFooter, Image, CardBody, Link} from "@heroui/react";
import {nullAsUndefined} from "null-as-undefined";
import {TrafiServiceCardProps} from 'TrafiTypes'
import {FC} from "react";
import {DEMO_MODE} from "@/app/outgoing/traefik/config";
import {applyDemoDomainOverride} from "@/app/utils";

export const TrafiServiceCard: FC<TrafiServiceCardProps> = ({trafiService}: TrafiServiceCardProps) => {
    const serviceName = trafiService.name
    const serviceRoute = trafiService.rule
    let serviceDomain = serviceRoute.split("://")[1]
    const thumbnailUrl = trafiService.thumbnailUrl
    const faviconUrl = serviceRoute + '/favicon.ico'
    if (DEMO_MODE) {
        serviceDomain = applyDemoDomainOverride(serviceDomain);
    }
    return (
            <Card
                key={serviceName}
                isFooterBlurred
                onPress={(e) => window.open(serviceRoute)}
                radius="lg"
                className="border-none border-white/20 object-cover max-w-[300px] text-wrap"
                fullWidth={true}
                shadow={"md"}
            >
                <Link href={serviceRoute} target={"_blank"}>
                    <Image
                        isZoomed
                        height="130px"
                        width="100%"
                        // src={nullAsUndefined(thumbnailUrl) ? thumbnailUrl : "https://picsum.photos/350/150"}
                        src={nullAsUndefined(thumbnailUrl) ? thumbnailUrl!! : "/default-service-thumbnail.jpeg"}
                        // src={"https://picsum.photos/350/200"}
                        alt={`thumbnail-${serviceName}`}
                    />
                    <CardBody
                        className="backdrop-blur-sm bg-gray-500/30 border-gray-400 before:bg-white/10 border-white/20 border-1 flex-row overflow-hidden py-1 z-20 absolute before:rounded-xl rounded-large bottom-9 w-[calc(100%_-_8px)] shadow-small ml-1"
                    >
                        <div className="h-6 w-6 mr-3 inline-block">
                            <Image
                                isBlurred
                                height="100%"
                                width="100%"
                                className="h-6"
                                src={faviconUrl}
                                alt="favicon"
                            ></Image>
                        </div>
                        <p className="inline-block text-white/80">
                            {serviceName}
                        </p>
                    </CardBody>
                    <CardFooter
                        className="absolute bg-gray-500/30 border-gray-400 bottom-0 border-t-1 border-white/20 z-10 justify-between p-3 pt-1.5 pb-1.5">
                        <p className="text-tiny text-white/70 shadow overflow-hidden">
                            {serviceDomain}
                        </p>
                    </CardFooter>
                </Link>
            </Card>
    )
}
