import { useState, useEffect } from 'react';
import { MAX_PAINT_CAN, REFILL_AMOUNT, REFILL_INTERVAL_MS } from '../constants';

export const usePaintCan = (): [number, React.Dispatch<React.SetStateAction<number>>] => {
    const [paintCan, setPaintCan] = useState<number>(MAX_PAINT_CAN);

    useEffect(() => {
        const refillInterval = setInterval(() => {
            setPaintCan(prev => Math.min(MAX_PAINT_CAN, prev + REFILL_AMOUNT));
        }, REFILL_INTERVAL_MS);
        return () => clearInterval(refillInterval);
    }, []);

    return [paintCan, setPaintCan];
};
