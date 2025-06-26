/**
 * Configuration factory for expandable table relationships
 * Defines how different entities and their related data should be displayed
 */

import { renderAmount as renderRateBreakdownAmount, renderRateType } from '../app/(protected)/(with-sidebar)/rateBreakdowns/rateBreakdownRenderers';
import StatusChip from './StatusChip';

// Configuration for Rate → Rate Breakdowns relationship
export const rateBreakdownConfig = {
  entityName: 'Rate Breakdown',
  parentEntityName: 'Rate',
  title: 'Rate Breakdowns',
  parentNameField: 'name',
  renderItem: (breakdown) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <span className="font-medium text-gray-800">{breakdown.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          {renderRateBreakdownAmount(breakdown.amount)}
        </div>
        <div>
          {renderRateType(breakdown.rateType)}
        </div>
      </div>
    </div>
  )
};

// Configuration for Operator → Stations relationship
export const operatorStationConfig = {
  entityName: 'Station',
  parentEntityName: 'Operator',
  title: 'Stations',
  parentNameField: 'name',
  renderItem: (station) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <div>
          <span className="font-medium text-gray-800">{station.name}</span>
          {station.code && (
            <span className="ml-2 text-xs text-gray-500">({station.code})</span>
          )}
        </div>
        {station.location && (
          <div className="text-xs text-gray-600 mt-1">{station.location}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div>
          <StatusChip status={station.active ? 'available' : 'unavailable'} />
        </div>
        {station.chargingBayCount && (
          <div className="text-xs text-gray-500">
            {station.chargingBayCount} bays
          </div>
        )}
      </div>
    </div>
  )
};

// Configuration for Station → Charging Bays relationship
export const stationChargingBayConfig = {
  entityName: 'Charging Bay',
  parentEntityName: 'Station',
  title: 'Charging Bays',
  parentNameField: 'name',
  renderItem: (bay) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <div>
          <span className="font-medium text-gray-800">{bay.code}</span>
          {bay.name && bay.name !== bay.code && (
            <span className="ml-2 text-sm text-gray-600">{bay.name}</span>
          )}
        </div>
        {bay.powerRating && (
          <div className="text-xs text-gray-600 mt-1">{bay.powerRating} kW</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div>
          <StatusChip status={bay.status || 'available'} />
        </div>
        {bay.connectorCount && (
          <div className="text-xs text-gray-500">
            {bay.connectorCount} connectors
          </div>
        )}
      </div>
    </div>
  )
};

// Configuration for User → User Sessions relationship (if needed)
export const userSessionConfig = {
  entityName: 'Session',
  parentEntityName: 'User',
  title: 'Charging Sessions',
  parentNameField: 'name',
  renderItem: (session) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <span className="font-medium text-gray-800">Session #{session.id}</span>
        {session.startTime && (
          <div className="text-xs text-gray-600 mt-1">
            Started: {new Date(session.startTime).toLocaleDateString()}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div>
          <StatusChip status={session.status || 'completed'} />
        </div>
        {session.energyConsumed && (
          <div className="text-xs text-gray-500">
            {session.energyConsumed} kWh
          </div>
        )}
      </div>
    </div>
  )
};

// Export all configurations
export const expandableConfigs = {
  rateBreakdowns: rateBreakdownConfig,
  operatorStations: operatorStationConfig,
  stationChargingBays: stationChargingBayConfig,
  userSessions: userSessionConfig
};

export default expandableConfigs;
