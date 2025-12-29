"use client";

import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { customClass?: string }>(
  ({ customClass, className, ...rest }, ref) => (
    <div 
      ref={ref} 
      {...rest} 
      className={`card ${customClass ?? ''} ${className ?? ''}`.trim()} 
    />
  )
);
Card.displayName = 'Card';

interface CardSwapProps {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  children: React.ReactNode;
}

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
  scale: 1 - (i * 0.04) // Each card behind scales down by 4%
});

const placeNow = (el: HTMLElement | null, slot: ReturnType<typeof makeSlot>, skew: number) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    scale: slot.scale,
    force3D: true
  });
};

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 0,
  verticalDistance = 45,
  onCardClick,
  skewAmount = 6,
  children
}) => {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  // Always start with card 0 (Browse Ingredients) at the front
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const hoverStatesRef = useRef<Map<number, { originalY: number }>>(new Map());
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const total = refs.length;
    if (total === 0) return;
    
    // Ensure card 0 (Browse Ingredients) is always at the front initially
    const initialOrder = [0, ...Array.from({ length: total - 1 }, (_, i) => i + 1)];
    order.current = initialOrder;
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      refs.forEach((r, position) => {
        const cardIndex = initialOrder[position];
        const slot = makeSlot(position, cardDistance, verticalDistance, total);
        
        if (r.current) {
          // Set opacity based on position (front = 1, behind = lower opacity)
          const opacity = position === 0 ? 1 : 1 - (position * 0.2); // Front: 1, Card 2: 0.8, Card 3: 0.6, etc.
          // Set brightness filter (further back = darker)
          const brightness = 1 - (position * 0.1);
          // Make back cards lighter (higher background opacity)
          const bgOpacity = position === 0 ? 0.5 : Math.min(0.5 + (position * 0.15), 0.8); // Front: 0.5, back cards get lighter
          hoverStatesRef.current.set(cardIndex, { originalY: slot.y });
          
          // Place card with all properties in one call
          placeNow(r.current, slot, skewAmount);
          gsap.set(r.current, {
            opacity: Math.max(opacity, 0.4),
            filter: `brightness(${Math.max(brightness, 0.6)})` // Apply brightness falloff
          });
          
          // Set CSS variable for background opacity to make back cards lighter
          r.current.style.setProperty('--card-bg-opacity', bgOpacity.toString());
        }
      });
    });
  }, [cardDistance, verticalDistance, skewAmount, refs.length]);

  const swapToFront = (targetIndex: number) => {
    if (order.current.length < 2) return;
    
    const currentPosition = order.current.indexOf(targetIndex);
    if (currentPosition === 0) return; // Already at front

    // Kill any ongoing animations
    tlRef.current?.kill();
    
    const [front, ...rest] = order.current;
    const elFront = refs[front].current;
    const elTarget = refs[targetIndex].current;
    
    if (!elFront || !elTarget) return;

    // Create new order with target at front, maintaining the relative order of other cards
    const currentOrder = order.current;
    const targetPosition = currentOrder.indexOf(targetIndex);
    
    // Rotate the array: move target to front, keep others in same relative order
    const newOrder = [
      targetIndex,
      ...currentOrder.slice(targetPosition + 1),
      ...currentOrder.slice(0, targetPosition)
    ];
    order.current = newOrder;

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tlRef.current = tl;

      // Animate the old front card: slide out to the side and back
      const backSlot = makeSlot(newOrder.length - 1, cardDistance, verticalDistance, refs.length);
      const backOpacity = 1 - ((newOrder.length - 1) * 0.2);
      const backBrightness = 1 - ((newOrder.length - 1) * 0.1);
      const backBgOpacity = Math.min(0.5 + ((newOrder.length - 1) * 0.15), 0.8);
      tl.to(elFront, {
        x: -300,
        rotation: -10,
        opacity: Math.max(backOpacity, 0.4),
        filter: `brightness(${Math.max(backBrightness, 0.6)})`,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => {
          if (elFront) elFront.style.setProperty('--card-bg-opacity', backBgOpacity.toString());
        }
      });
      tl.to(elFront, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        rotation: 0,
        scale: backSlot.scale,
        opacity: Math.max(backOpacity, 0.4),
        filter: `brightness(${Math.max(backBrightness, 0.6)})`,
        zIndex: backSlot.zIndex,
        duration: 0.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (elFront) elFront.style.setProperty('--card-bg-opacity', backBgOpacity.toString());
        }
      }, '-=0.15');

    // Animate all other cards forward
    newOrder.forEach((idx, i) => {
      if (idx === targetIndex) return; // Skip the target card
      
      const el = refs[idx].current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
      const newOpacity = i === 0 ? 1 : 1 - (i * 0.2);
      const newBrightness = 1 - (i * 0.1);
      const newBgOpacity = i === 0 ? 0.5 : Math.min(0.5 + (i * 0.15), 0.8);
      
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          scale: slot.scale,
          opacity: Math.max(newOpacity, 0.4),
          filter: `brightness(${Math.max(newBrightness, 0.6)})`,
          zIndex: slot.zIndex,
          duration: 0.7,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (el) el.style.setProperty('--card-bg-opacity', newBgOpacity.toString());
          }
        },
        i === 1 ? 0 : `-=${0.5}`
      );
    });

    // Animate the target card to front
    const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
    tl.to(
      elTarget,
      {
        x: frontSlot.x,
        y: frontSlot.y,
        z: frontSlot.z,
        scale: frontSlot.scale,
        opacity: 1,
        filter: 'brightness(1)',
        zIndex: frontSlot.zIndex,
        rotation: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (elTarget) elTarget.style.setProperty('--card-bg-opacity', '0.5');
        }
      },
      0
    );

    // Update hover states and background opacity
    newOrder.forEach((idx, position) => {
      const el = refs[idx].current;
      if (el) {
        const slot = makeSlot(position, cardDistance, verticalDistance, refs.length);
        const bgOpacity = position === 0 ? 0.5 : Math.min(0.5 + (position * 0.15), 0.8);
        hoverStatesRef.current.set(idx, { originalY: slot.y });
        el.style.setProperty('--card-bg-opacity', bgOpacity.toString());
      }
    });
  };

  // Handle hover for back cards (peek effect)
  useEffect(() => {
    const handleMouseEnter = (cardIndex: number) => {
      const currentPosition = order.current.indexOf(cardIndex);
      if (currentPosition === 0) return; // Front card doesn't peek
      
      const el = refs[cardIndex].current;
      if (!el) return;
      const hoverState = hoverStatesRef.current.get(cardIndex);
      if (!hoverState) return;
      
      gsap.to(el, {
        y: hoverState.originalY - 25, // Move up by 25px
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = (cardIndex: number) => {
      const el = refs[cardIndex].current;
      if (!el) return;
      const hoverState = hoverStatesRef.current.get(cardIndex);
      if (!hoverState) return;
      
      gsap.to(el, {
        y: hoverState.originalY, // Return to original position
        duration: 0.3,
        ease: 'power2.in'
      });
    };

    // Attach hover listeners to all cards
    const cleanupFunctions: (() => void)[] = [];
    
    refs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      
      const mouseEnterHandler = () => handleMouseEnter(i);
      const mouseLeaveHandler = () => handleMouseLeave(i);
      
      el.addEventListener('mouseenter', mouseEnterHandler);
      el.addEventListener('mouseleave', mouseLeaveHandler);
      
      cleanupFunctions.push(() => {
        el.removeEventListener('mouseenter', mouseEnterHandler);
        el.removeEventListener('mouseleave', mouseLeaveHandler);
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { 
            width, 
            height: height, // Fixed height for all cards
            maxHeight: height, // Ensure no card exceeds this height
            overflow: 'visible', // Allow rounded corners to show
            borderRadius: '48px', // Match the card's rounded corners
            ...(child.props.style ?? {})
          },
          onClick: (e: React.MouseEvent) => {
            const currentPosition = order.current.indexOf(i);
            
            // Check if the click originated from a recipe row (has data-recipe-click attribute)
            const target = e.target as HTMLElement;
            const isRecipeClick = target.closest('[data-recipe-click]');
            
            // If it's a recipe click, stop propagation and let the card handle it
            if (isRecipeClick) {
              e.stopPropagation();
              child.props.onClick?.(e);
              return;
            }
            
            // Only allow clicking on the front card (position 0) to trigger swaps
            if (currentPosition === 0) {
              // Check if click is on the header/top area (first 80px from top)
              const cardElement = refs[i].current;
              
              if (!cardElement) return;
              
              // Get click position relative to card
              const rect = cardElement.getBoundingClientRect();
              const clickY = e.clientY - rect.top;
              
              // Only trigger swap if clicking in the top 80px (header area)
              if (clickY <= 80) {
                e.stopPropagation();
                
                // Cycle to next card in order (wrap around to first if at end)
                const currentOrder = order.current;
                const currentIndex = currentOrder.indexOf(i);
                const nextIndex = (currentIndex + 1) % currentOrder.length;
                const nextCardIndex = currentOrder[nextIndex];
                
                if (nextCardIndex !== undefined && nextCardIndex !== i) {
                  swapToFront(nextCardIndex);
                  onCardClick?.(nextCardIndex);
                } else {
                  onCardClick?.(i);
                }
              } else {
                // Click below header - let it pass through to inner content
                child.props.onClick?.(e);
              }
            } else {
              // Back cards are not clickable for swapping
              child.props.onClick?.(e);
            }
          }
        })
      : child
  );

  return (
    <div className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
