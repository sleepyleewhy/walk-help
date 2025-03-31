import { CrosswalkNode } from "@/models/crosswalkNode";
import { CrosswalkWay } from "@/models/crosswalkWay";
import { Location } from "@/models/location";
import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";

const useCrosswalkLocator = (
    location: Location | null,
    alertlevel: number,
    setCrosswalkId : React.Dispatch<SetStateAction<number>>,
    orientation: number) => {


    const crosswalks = useRef<CrosswalkWay[]>([]);
    const filteredCrosswalks = useRef<CrosswalkWay[]>([]);
    const crosswalksNodes = useRef<CrosswalkNode[]>([]);
    const [isCrosswalkLocatorActive, setIsCrosswalkLocatorActive] = useState<boolean>(false);
    const intervalId = useRef<number | null>(null);


    const calculateCrosswalkAngle = useCallback((crosswalkWay: CrosswalkWay) => {
        if (crosswalkWay.nodes.length < 2) return -1;
        const startNode = crosswalkWay.nodes[0];
        const endNode = crosswalkWay.nodes[crosswalkWay.nodes.length - 1];
        const deltaX = endNode.lon - startNode.lon;
        const deltaY = endNode.lat - startNode.lat;
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        return (angle + 360) % 360;
    }, [])

    const filterCrosswalksByAngle = useCallback((crosswalks: CrosswalkWay[], angleThreshold: number = 20) => {
        return crosswalks.filter((crosswalk) => {
            if (crosswalk.angle) {
                const angleDifference = Math.abs(crosswalk.angle - orientation);
                if (Math.min(angleDifference, 360 - angleDifference) < angleThreshold) {
                    return true;
                }
            }
            return false;
        })
    }, [orientation])
    const filterNodesByAlone = (crosswalksNodes: CrosswalkNode[]) => {
        return crosswalksNodes.filter((crosswalkNode) => crosswalkNode.isAlone);
    }

    


    // Haversine Formula
    const calculateNodeDistance = useCallback((node: CrosswalkNode) => {
        if (!location) return -1;
        const toRadians = (degrees: number) => degrees * (Math.PI / 180);

        const earthRadius = 6371e3; // Earth's radius in meters
        const lat1 = toRadians(location.latitude);
        const lon1 = toRadians(location.longitude);
        const lat2 = toRadians(node.lat);
        const lon2 = toRadians(node.lon);

        const deltaLat = lat2 - lat1;
        const deltaLon = lon2 - lon1;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c; // Distance in meters
    }, [location]);

    const calculateWayDistance = useCallback((crosswalkWay: CrosswalkWay) => {
        let bestDistance = Infinity;

        for (const node of crosswalkWay.nodes) {
            const distance = calculateNodeDistance(node);
            if (distance < bestDistance) {
                bestDistance = distance;
            }
        }
        return bestDistance;
    },[calculateNodeDistance])




    // Fetch crosswalks from Overpass API
    // This function fetches crosswalks from the Overpass API based on the user's location
    const getCrosswalksNearby = useCallback(async () => {
        if (!location) return;
        if (location.accuracy > 500) {
            console.log('accuracy too low')
            throw new Error("Location accuracy is too low");
        }
        try {
            const response = await fetch("https://overpass.private.coffee/api/interpreter",
                {
                    method: "POST",
                    body: `data= ${encodeURIComponent(`
                        [out:json];
                        (
                            way["highway"="footway"]["footway"="crossing"](around:${location.accuracy}, ${location.latitude}, ${location.longitude});
                            node["highway"="crossing"]["crossing:markings"="zebra"](around:${location.accuracy}, ${location.latitude}, ${location.longitude});
                        );
                        out body;
                        >;
                        out skel qt;
                        `)}`
                }
            ).then((res) => res.json())

            const allCrosswalksNodes = response.elements
                .filter((element: { type: string }) => element.type === 'node')
                .map((element: { id: number; lat: number; lon: number }) => {
                    const crosswalkNode: CrosswalkNode = {
                        id: element.id,
                        lon: element.lon,
                        lat: element.lat,
                        isAlone: true
                    };
                    return crosswalkNode;
                })
            crosswalks.current = response.elements
                .filter((element: { type: string }) => element.type === 'way')
                .map((element: { id: number, nodes: number[] }) => {
                    const crosswalkWay: CrosswalkWay = {
                        id: element.id,
                        nodes: element.nodes.map((nodeId: number) => {
                            const node = allCrosswalksNodes.find((node: CrosswalkNode) => node.id === nodeId)
                            if (node) {
                                node.isAlone = false;
                                return node;
                            } else {
                                throw new Error(`Node with id ${nodeId} not found`);
                            }
                        }),
                    };
                    crosswalkWay.angle = calculateCrosswalkAngle(crosswalkWay);
                    return crosswalkWay;
                });
            filteredCrosswalks.current = filterCrosswalksByAngle(crosswalks.current);
            crosswalksNodes.current = filterNodesByAlone(allCrosswalksNodes);
        } catch (err) {
            console.error("Error fetching crosswalks:", err);
        }
    }, [location, filterCrosswalksByAngle, calculateCrosswalkAngle])

    const chooseEndangeredCrosswalk = useCallback(async () => {
        try {
            await getCrosswalksNearby();
        }
        catch (err) {
            console.error(err);
            return -1;
        }
        let bestCrosswalk = null;
        let bestCrosswalkDistance = Infinity;

        let bestNode = null;
        let bestNodeDistance = Infinity;

        for (const crosswalk of filteredCrosswalks.current) {
            const distance = calculateWayDistance(crosswalk);
            if (distance < bestCrosswalkDistance) {
                bestCrosswalk = crosswalk;
                bestCrosswalkDistance = distance;
            }
        }
        for (const node of crosswalksNodes.current) {
            const distance = calculateNodeDistance(node);
            if (distance < bestNodeDistance) {
                bestNode = node;
                bestNodeDistance = distance;
            }
        }

        if (!bestCrosswalk && !bestNode) return 0;
        if (!bestCrosswalk && bestNode) return bestNode.id;
        if (!bestNode && bestCrosswalk) return bestCrosswalk.id;
        if (bestCrosswalkDistance / 3 < bestNodeDistance) {

            return bestCrosswalk!.id;
        }
        else {
            return bestNode!.id;
        }


    }, [calculateNodeDistance, calculateWayDistance, getCrosswalksNearby])


    useEffect(() => {
        
        if (alertlevel >= 1) {
            setIsCrosswalkLocatorActive(true)
            if (!intervalId.current){
                intervalId.current = window.setInterval(async () => {
                    const id = await chooseEndangeredCrosswalk()
                    setCrosswalkId(id)}, 5000);
            }
            

        }
        else {
            setIsCrosswalkLocatorActive(false);
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        }
        return () => {
            setIsCrosswalkLocatorActive(false)
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        }


    }, [alertlevel, setCrosswalkId, chooseEndangeredCrosswalk]);


    return isCrosswalkLocatorActive


}


export default useCrosswalkLocator;