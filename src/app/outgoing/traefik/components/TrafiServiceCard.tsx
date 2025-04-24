'use client';
import {Card, CardFooter, Image, CardBody, Link} from "@heroui/react";
import { nullAsUndefined } from "null-as-undefined";

export function TrafiServiceCard({serviceName, serviceRoute, thumbnailUrl}: {serviceName: string; serviceRoute: string; thumbnailUrl: string | null}) {
    return (
        <div key={serviceName} className="text-wrap">
            <Card
                isFooterBlurred
                isPressable
                onPress={(e) => window.open(serviceRoute)}
                radius="lg"
                className="border-none object-cover"
                fullWidth={true}
            >
                <Link href={serviceRoute} target={"_blank"}>
                    {/*<CardBody className="overflow-visible p-0">*/}
                        <Image
                            isZoomed
                            height="100%"
                            width="100%"
                            // src={nullAsUndefined(thumbnailUrl) ? thumbnailUrl : "https://picsum.photos/350/150"}
                            src={nullAsUndefined(thumbnailUrl) ? thumbnailUrl!! : "/default-service-thumbnail.jpeg"}
                            // src={"https://picsum.photos/350/200"}
                            alt={`thumbnail-${serviceName}`}
                        ></Image>
                    {/*</CardBody>*/}
                    <CardBody
                        className="backdrop-blur-sm bg-gray-500/30 border-gray-400 before:bg-white/10 border-white/20 border-1 flex-row overflow-hidden py-1 z-20 absolute before:rounded-xl rounded-large bottom-9 w-[calc(100%_-_8px)] shadow-small ml-1"
                    >
                        <div className="h-6 w-6 mr-3 inline-block">
                            <Image
                                height="100%"
                                width="100%"
                                className="h-6"
                                src={serviceRoute + '/favicon.ico'}
                            ></Image>
                        </div>
                        <p className="inline-block text-white/80">
                            {serviceName}
                        </p>
                    </CardBody>
                    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between p-3 pt-1.5 pb-1.5">
                        {/*<div>*/}
                            <p className="text-tiny text-white/80">{serviceRoute.split("://")[1]}</p>
                            {/*<p className="text-black text-tiny">Available soon.</p>*/}
                            {/*<p className="text-black text-tiny">Get notified.</p>*/}
                        {/*</div>*/}
                        {/*<Button className="text-tiny" color="primary" radius="full" size="sm">*/}
                        {/*    Notify Me*/}
                        {/*</Button>*/}
                    </CardFooter>
                </Link>
            </Card>
        </div>
    )
}