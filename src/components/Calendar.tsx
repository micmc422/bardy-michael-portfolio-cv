'use client';

import { Button } from '@/once-ui/components';

export default function AvailabilityCalendar({ href = "https://cal.com/occitaweb" }: { href?: string }) {
    return (
        <Button id="arrow-button-1" arrowIcon href={href} target='_blank' rel='noopener noreferrer'>
            Sélectionner une date
        </Button>
    );
}
