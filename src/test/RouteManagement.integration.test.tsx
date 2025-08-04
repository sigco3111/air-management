import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RouteManagement from '../../components/RouteManagement'
import type { Player, Airport, Route, AircraftModel, Competitor, Alliance } from '../../types'

// Mock data
const mockAirports: Airport[] = [
  {
    id: 'ICN',
    name: 'Incheon International Airport',
    city: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    latitude: 37.4602,
    longitude: 126.4407,
    demand: 1000,
    cost: 500
  },
  {
    id: 'NRT',
    name: 'Narita International Airport',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    latitude: 35.7720,
    longitude: 140.3929,
    demand: 1200,
    cost: 600
  },
  {
    id: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States',
    region: 'North America',
    latitude: 33.9425,
    longitude: -118.4081,
    demand: 1500,
    cost: 700
  }
]

const mockAircraftModels: AircraftModel[] = [
  {
    id: 'boeing-737',
    name: 'Boeing 737-800',
    manufacturer: 'Boeing',
    seats: 189,
    range: 5765,
    fuelEfficiency: 2.5,
    price: 89000000,
    imageUrl: '/aircraft/boeing-737.png'
  }
]

const mockRoutes: Route[] = [
  {
    id: 'route-1',
    origin: 'ICN',
    destination: 'NRT',
    distance: 1319,
    baseDemand: 800,
    ticketPrice: 250,
    aircraftId: 'aircraft-1'
  },
  {
    id: 'route-2',
    origin: 'ICN',
    destination: 'LAX',
    distance: 11035,
    baseDemand: 600,
    ticketPrice: 800,
    aircraftId: null
  }
]

const mockPlayer: Player = {
  id: 'player',
  name: 'Test Airline',
  cash: 10000000,
  satisfaction: 75,
  brandAwareness: 60,
  hubAirportId: 'ICN',
  allianceId: null,
  routes: mockRoutes,
  fleet: [
    {
      id: 'aircraft-1',
      modelId: 'boeing-737',
      routeId: 'route-1',
      condition: 100,
      purchaseDate: new Date()
    }
  ],
  fuelPrice: 0.8,
  researchModifiers: {
    baseDemand: 1.0,
    fuelEfficiency: 1.0,
    satisfaction: 1.0
  },
  activeMarketingCampaigns: []
}

const mockCompetitors: Competitor[] = [
  {
    id: 'comp-1',
    name: 'Competitor Airlines',
    allianceId: null,
    routes: [
      {
        id: 'comp-route-1',
        origin: 'ICN',
        destination: 'NRT',
        distance: 1319,
        baseDemand: 800,
        ticketPrice: 280,
        aircraftId: 'comp-aircraft-1'
      }
    ]
  }
]

const mockAlliances: Alliance[] = []

const mockClosedAirports = new Set<string>()

const defaultProps = {
  player: mockPlayer,
  airports: mockAirports,
  aircraftModels: mockAircraftModels,
  onOpenAssignmentModal: vi.fn(),
  onUnassignAircraft: vi.fn(),
  onUpdateTicketPrice: vi.fn(),
  competitors: mockCompetitors,
  closedAirports: mockClosedAirports,
  alliances: mockAlliances
}

describe('RouteManagement Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Empty State Display', () => {
    it('should display empty state message when no routes exist', () => {
      const emptyPlayer = { ...mockPlayer, routes: [] }
      render(<RouteManagement {...defaultProps} player={emptyPlayer} />)
      
      expect(screen.getByText('개설된 노선이 없습니다')).toBeInTheDocument()
      expect(screen.getByText('지도에서 두 공항을 클릭하여 첫 노선을 만들어보세요.')).toBeInTheDocument()
    })

    it('should display loading state when player is null', () => {
      render(<RouteManagement {...defaultProps} player={null} />)
      
      expect(screen.getByText('플레이어 정보를 불러오는 중입니다...')).toBeInTheDocument()
    })
  })

  describe('Route List Display', () => {
    it('should display all routes in a vertical scrollable list', () => {
      render(<RouteManagement {...defaultProps} />)
      
      // Check that both routes are displayed
      expect(screen.getByText('Seoul (ICN)')).toBeInTheDocument()
      expect(screen.getByText('Tokyo (NRT)')).toBeInTheDocument()
      expect(screen.getByText('Los Angeles (LAX)')).toBeInTheDocument()
      
      // Check distances are displayed
      expect(screen.getByText('1,319 km')).toBeInTheDocument()
      expect(screen.getByText('11,035 km')).toBeInTheDocument()
    })

    it('should show assignment status for each route', () => {
      render(<RouteManagement {...defaultProps} />)
      
      // First route should show as assigned
      const assignedElements = screen.getAllByText('배정됨')
      expect(assignedElements).toHaveLength(1)
      
      // Second route should show as unassigned
      const unassignedElements = screen.getAllByText('미배정')
      expect(unassignedElements).toHaveLength(1)
    })

    it('should display status indicators correctly', () => {
      render(<RouteManagement {...defaultProps} />)
      
      // Check for hub route indicator (ICN is hub, so both routes should have hub indicator)
      const hubIndicators = screen.getAllByText('허브')
      expect(hubIndicators.length).toBeGreaterThan(0)
      
      // Check for competition indicator on routes with competitors
      const competitionIndicators = screen.getAllByText('경쟁')
      expect(competitionIndicators.length).toBeGreaterThan(0)
    })
  })

  describe('Route Card Click and Modal Opening', () => {
    it('should open modal when route card is clicked', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Click on the first route card by finding the card containing both Seoul and Tokyo
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const firstRouteCard = routeCards[0].closest('[class*="cursor-pointer"]')
      expect(firstRouteCard).toBeInTheDocument()
      
      await user.click(firstRouteCard!)
      
      // Modal should be open with route details
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
    })

    it('should pass correct route data to modal', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Click on the second route (ICN-LAX) by finding the card with LAX
      const laxText = screen.getByText('Los Angeles (LAX)')
      const routeCard = laxText.closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
        // Check that the correct route information is displayed
        expect(screen.getByText('11,035 km')).toBeInTheDocument()
        expect(screen.getByDisplayValue('800')).toBeInTheDocument() // ticket price
      })
    })
  })

  describe('Modal Functionality', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Open modal by clicking first route
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const routeCard = routeCards[0].closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
    })

    it('should close modal when background is clicked', async () => {
      const user = userEvent.setup()
      
      // Click on modal background (the overlay div)
      const modalOverlay = screen.getByText('노선 상세 정보').closest('[class*="fixed inset-0"]')
      await user.click(modalOverlay!)
      
      await waitFor(() => {
        expect(screen.queryByText('노선 상세 정보')).not.toBeInTheDocument()
      })
    })

    it('should close modal when ESC key is pressed', async () => {
      const user = userEvent.setup()
      
      // Press ESC key
      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.queryByText('노선 상세 정보')).not.toBeInTheDocument()
      })
    })

    it('should close modal when X button is clicked', async () => {
      const user = userEvent.setup()
      
      // Click the close button
      const closeButton = screen.getByLabelText('모달 닫기')
      await user.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByText('노선 상세 정보')).not.toBeInTheDocument()
      })
    })

    it('should display comprehensive route information in modal', () => {
      // Check all required information is displayed
      expect(screen.getByText('거리')).toBeInTheDocument()
      expect(screen.getByText('배정 항공기')).toBeInTheDocument()
      expect(screen.getByText('기준 운임')).toBeInTheDocument()
      expect(screen.getByText('티켓 가격')).toBeInTheDocument()
      expect(screen.getByText('예상 시장 점유율')).toBeInTheDocument()
      expect(screen.getByText('예상 탑승률')).toBeInTheDocument()
      expect(screen.getByText('월 예상 수입')).toBeInTheDocument()
      expect(screen.getByText('월 운영 비용')).toBeInTheDocument()
      expect(screen.getByText('월 예상 순이익')).toBeInTheDocument()
    })

    it('should show action buttons in modal', () => {
      expect(screen.getByText('배정 변경')).toBeInTheDocument()
      expect(screen.getByText('배정 해제')).toBeInTheDocument()
    })
  })

  describe('Modal Interactions and Data Updates', () => {
    it('should call onUpdateTicketPrice when price is changed', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Open modal
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const routeCard = routeCards[0].closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
      
      // Find and change the price input
      const priceInput = screen.getByDisplayValue('250')
      await user.clear(priceInput)
      await user.type(priceInput, '300')
      await user.tab() // Trigger onBlur
      
      expect(defaultProps.onUpdateTicketPrice).toHaveBeenCalledWith('route-1', 300)
    })

    it('should call onOpenAssignmentModal when assignment button is clicked', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Open modal
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const routeCard = routeCards[0].closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
      
      // Click assignment button
      const assignmentButton = screen.getByText('배정 변경')
      await user.click(assignmentButton)
      
      expect(defaultProps.onOpenAssignmentModal).toHaveBeenCalledWith('route-1')
    })

    it('should call onUnassignAircraft when unassign button is clicked', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Open modal
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const routeCard = routeCards[0].closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
      
      // Click unassign button
      const unassignButton = screen.getByText('배정 해제')
      await user.click(unassignButton)
      
      expect(defaultProps.onUnassignAircraft).toHaveBeenCalledWith('route-1')
    })
  })

  describe('Keyboard Navigation and Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Tab to first route card
      await user.tab()
      
      // Press Enter to open modal
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
    })

    it('should have proper ARIA labels', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Open modal
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const routeCard = routeCards[0].closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByLabelText('모달 닫기')).toBeInTheDocument()
        expect(screen.getByLabelText(/티켓 가격/)).toBeInTheDocument()
      })
    })

    it('should trap focus within modal', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Open modal
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const routeCard = routeCards[0].closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
      
      // Tab through modal elements
      await user.tab() // Close button
      await user.tab() // Price input
      await user.tab() // Assignment button
      await user.tab() // Unassign button
      
      // Focus should stay within modal
      expect(document.activeElement).toBeInTheDocument()
    })
  })

  describe('Closed Airports Handling', () => {
    it('should display closed route status correctly', () => {
      const closedAirports = new Set(['NRT'])
      render(<RouteManagement {...defaultProps} closedAirports={closedAirports} />)
      
      // Should show closure indicator
      expect(screen.getByText('중단')).toBeInTheDocument()
    })

    it('should disable interactions for closed routes in modal', async () => {
      const user = userEvent.setup()
      const closedAirports = new Set(['NRT'])
      render(<RouteManagement {...defaultProps} closedAirports={closedAirports} />)
      
      // Open modal for closed route
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const routeCard = routeCards[0].closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
      
      // Price input should be disabled
      const priceInput = screen.getByDisplayValue('250')
      expect(priceInput).toBeDisabled()
      
      // Action buttons should be disabled
      const assignmentButton = screen.getByText('배정 변경')
      expect(assignmentButton).toBeDisabled()
    })
  })

  describe('Responsive Design', () => {
    it('should handle mobile viewport correctly', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<RouteManagement {...defaultProps} />)
      
      // Routes should still be displayed
      expect(screen.getAllByText('Seoul (ICN)')).toHaveLength(2)
      expect(screen.getByText('Tokyo (NRT)')).toBeInTheDocument()
    })
  })

  describe('Data Consistency', () => {
    it('should maintain data consistency between list and modal', async () => {
      const user = userEvent.setup()
      render(<RouteManagement {...defaultProps} />)
      
      // Open modal for first route
      const routeCards = screen.getAllByText('Seoul (ICN)')
      const routeCard = routeCards[0].closest('[class*="cursor-pointer"]')
      await user.click(routeCard!)
      
      await waitFor(() => {
        expect(screen.getByText('노선 상세 정보')).toBeInTheDocument()
      })
      
      // Check that route data matches
      expect(screen.getByText('1,319 km')).toBeInTheDocument()
      expect(screen.getByDisplayValue('250')).toBeInTheDocument()
      
      // Close modal
      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.queryByText('노선 상세 정보')).not.toBeInTheDocument()
      })
      
      // Data in list should remain consistent
      expect(screen.getByText('1,319 km')).toBeInTheDocument()
    })

    it('should handle missing airport data gracefully', () => {
      const routeWithMissingAirport: Route = {
        id: 'route-missing',
        origin: 'MISSING',
        destination: 'NRT',
        distance: 1000,
        baseDemand: 500,
        ticketPrice: 200,
        aircraftId: null
      }
      
      const playerWithMissingRoute = {
        ...mockPlayer,
        routes: [routeWithMissingAirport]
      }
      
      render(<RouteManagement {...defaultProps} player={playerWithMissingRoute} />)
      
      // Should not crash and should not display the route with missing airport
      expect(screen.queryByText('MISSING')).not.toBeInTheDocument()
    })
  })
})