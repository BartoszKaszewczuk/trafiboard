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
                <Link href={serviceRoute}>
                    <CardBody className="overflow-visible p-0">
                        <Image
                            isZoomed
                            height="100%"
                            width="100%"
                            // src={nullAsUndefined(thumbnailUrl) ? thumbnailUrl : "https://picsum.photos/350/150"}
                            src={nullAsUndefined(thumbnailUrl) ? thumbnailUrl!! : "/default-service-thumbnail.jpeg"}
                            alt={`thumbnail-${serviceName}`}
                        ></Image>
                    </CardBody>
                    <CardFooter
                        className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10"
                    >
                        <div className="h-6 w-6 mr-3">
                            <Image
                                height="100%"
                                className="h-6"
                                src={serviceRoute + '/favicon.ico'}
                            ></Image>
                        </div>
                        <p className="inline-block text-white/80">
                            {serviceName}
                        </p>
                    </CardFooter>
                </Link>
            </Card>
        </div>
    )
}