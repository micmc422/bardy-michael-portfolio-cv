"use client"

import { Row } from "@once-ui-system/core"
import { useEffect, useRef, useState, type MouseEvent } from "react"

interface DraggableFlexRowProps {
    children: React.ReactNode
    className?: string
}

export function DraggableFlexRow({ children }: DraggableFlexRowProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [hasOverflow, setHasOverflow] = useState(false)

    // Vérifier s'il y a overflow
    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current) {
                const { scrollWidth, clientWidth } = containerRef.current
                setHasOverflow(scrollWidth > clientWidth)
            }
        }

        checkOverflow()
        window.addEventListener("resize", checkOverflow)
        return () => window.removeEventListener("resize", checkOverflow)
    }, [children])

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!hasOverflow) return

        setIsDragging(true)
        setStartX(e.pageX - (containerRef.current?.offsetLeft || 0))
        setScrollLeft(containerRef.current?.scrollLeft || 0)
    }

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !hasOverflow) return

        e.preventDefault()
        const x = e.pageX - (containerRef.current?.offsetLeft || 0)
        const walk = (x - startX) * 2 // Vitesse de défilement
        if (containerRef.current) {
            containerRef.current.scrollLeft = scrollLeft - walk
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    return (
        <Row
            paddingY="m" overflowX="auto"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
                scrollbarWidth: "auto", // Firefox
                msOverflowStyle: "none", // IE
                WebkitOverflowScrolling: "touch",
                cursor: hasOverflow ? isDragging ? "grabbing" : "" : "default"
            }}
        >
            {children}
        </Row>
    )
}