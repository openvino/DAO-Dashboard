import React, { useEffect, useState } from 'react';
import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { Button } from '@/src/components/ui/Button';
import {
  HiBarsArrowDown,
  HiCalendar,
  HiChevronDown,
  HiChevronUp,
} from 'react-icons/hi2';
import { cn } from '@/src/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';

type ProposalSortBy = 'CREATED_AT';
type SortDirection = 'ASC' | 'DESC';

const sortProps = [
  {
    value: 'CREATED_AT',
    icon: HiCalendar,
    label: 'Creation date',
  },
];

enum DirectionState {
  NONE,
  ASC,
  DESC,
}

const incrementDirectionState = (state: DirectionState) => {
  return (state + 1) % 3;
};

const SortSelector = ({
  setSortBy,
  setDirection,
}: {
  setSortBy: (sortBy: ProposalSortBy) => void;
  setDirection: (direction: SortDirection | undefined) => void;
}) => {
  const [sortBySelected, setSortBySelected] =
    useState<ProposalSortBy>('CREATED_AT');
  const [directionSelected, setDirectionSelected] = useState<DirectionState>(
    DirectionState.NONE
  );

  useEffect(() => {
    setSortBy(sortBySelected);
  }, [sortBySelected]);

  useEffect(() => {
    switch (directionSelected) {
      case DirectionState.NONE:
        setDirection(undefined);
        break;
      case DirectionState.ASC:
        setDirection('ASC');
        break;
      case DirectionState.DESC:
        setDirection('DESC');
        break;
    }
  }, [directionSelected]);

  return (
    <>
      <Dropdown>
        <DropdownMenuTrigger asChild>
          <Button variant="subtle" size="sm" icon={HiBarsArrowDown} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={sortBySelected}
            onValueChange={(v) => setSortBySelected(v as ProposalSortBy)}
          >
            {sortProps.map((prop) => (
              <DropdownMenuRadioItem
                key={prop.value}
                value={prop.value}
                className={cn(
                  'flex flex-row justify-start gap-x-2 hover:cursor-pointer',
                  sortBySelected == prop.value && 'text-primary-highlight'
                )}
              >
                <prop.icon className="h-5 w-5" />
                {prop.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </Dropdown>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="subtle"
              size="sm"
              iconNode={
                <div className="relative flex h-4 w-4 flex-col items-center justify-center">
                  <HiChevronUp
                    className={cn(
                      'h-3 w-3 shrink-0 transition-all duration-200',
                      directionSelected === DirectionState.ASC && 'scale-150',
                      directionSelected === DirectionState.DESC &&
                        'rotate-180 scale-150',
                      directionSelected === DirectionState.NONE && '-mb-0.5'
                    )}
                  />
                  <HiChevronDown
                    className={cn(
                      'h-3 w-3 shrink-0 transition-all duration-200',
                      (directionSelected === DirectionState.DESC ||
                        directionSelected === DirectionState.ASC) &&
                        'hidden rotate-180 scale-150',
                      directionSelected === DirectionState.NONE && '-mt-0.5'
                    )}
                  />
                </div>
              }
              onClick={() =>
                setDirectionSelected(incrementDirectionState(directionSelected))
              }
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Sort{' '}
              {directionSelected === DirectionState.ASC
                ? 'ascending'
                : directionSelected === DirectionState.DESC
                ? 'descending'
                : 'disabled'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default SortSelector;
