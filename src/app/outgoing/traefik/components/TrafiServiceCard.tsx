'use client';
import {Card, CardFooter, Image, CardBody, Link} from "@heroui/react";
import {nullAsUndefined} from "null-as-undefined";

export function TrafiServiceCard({serviceName, serviceRoute, thumbnailUrl}: {
    serviceName: string;
    serviceRoute: string;
    thumbnailUrl: string | null;
}) {
    const faviconUrl = serviceRoute + '/favicon.ico'
    return (
            <Card
                key={serviceName}
                isFooterBlurred
                onPress={(e) => window.open(serviceRoute)}
                radius="lg"
                className="border-none object-cover max-w-[300px] text-wrap"
                fullWidth={true}
            >
                <Link href={serviceRoute} target={"_blank"}>
                    {/*<CardBody className="overflow-visible p-0">*/}
                    <Image
                        isZoomed
                        height="130px"
                        width="100%"
                        // src={nullAsUndefined(thumbnailUrl) ? thumbnailUrl : "https://picsum.photos/350/150"}
                        src={nullAsUndefined(thumbnailUrl) ? thumbnailUrl!! : "/default-service-thumbnail.jpeg"}
                        // src={"https://picsum.photos/350/200"}
                        alt={`thumbnail-${serviceName}`}
                    />
                    {/*</CardBody>*/}
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
                            {serviceRoute.split("://")[1]}
                        </p>
                    </CardFooter>
                </Link>
            </Card>
    )
}
