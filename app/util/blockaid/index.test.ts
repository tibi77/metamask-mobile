import { getBlockaidMetricsParams } from '.';
import {
  Reason,
  ResultType,
  SecurityAlertResponse,
} from '../../components/UI/BlockaidBanner/BlockaidBanner.types';
// eslint-disable-next-line import/no-namespace
import * as NetworkControllerMock from '../../selectors/networkController';
import { NETWORKS_CHAIN_ID } from '../../constants/network';

describe('getBlockaidMetricsParams', () => {
  beforeEach(() => {
    jest
      .spyOn(NetworkControllerMock, 'selectChainId')
      .mockReturnValue(NETWORKS_CHAIN_ID.MAINNET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty object when securityAlertResponse is not defined', () => {
    const result = getBlockaidMetricsParams(undefined);
    expect(result).toStrictEqual({});
  });

  it('returns enpty object when chain id is not in supported chain ids list', () => {
    jest.spyOn(NetworkControllerMock, 'selectChainId').mockReturnValue('10');
    const result = getBlockaidMetricsParams(undefined);
    expect(result).toStrictEqual({});
  });

  it('should return additionalParams object when securityAlertResponse is defined', () => {
    const securityAlertResponse: SecurityAlertResponse = {
      result_type: ResultType.Malicious,
      reason: Reason.notApplicable,
      providerRequestsCount: {
        eth_call: 5,
        eth_getCode: 3,
      },
      features: [],
    };

    const result = getBlockaidMetricsParams(securityAlertResponse);
    expect(result).toEqual({
      ui_customizations: ['flagged_as_malicious'],
      security_alert_response: ResultType.Malicious,
      security_alert_reason: Reason.notApplicable,
      ppom_eth_call_count: 5,
      ppom_eth_getCode_count: 3,
    });
  });

  it('should not return eth call counts if providerRequestsCount is empty', () => {
    const securityAlertResponse: SecurityAlertResponse = {
      result_type: ResultType.Malicious,
      reason: Reason.notApplicable,
      features: [],
      providerRequestsCount: {},
    };

    const result = getBlockaidMetricsParams(securityAlertResponse);
    expect(result).toEqual({
      ui_customizations: ['flagged_as_malicious'],
      security_alert_response: ResultType.Malicious,
      security_alert_reason: Reason.notApplicable,
    });
  });

  it('should not return eth call counts if providerRequestsCount is undefined', () => {
    const securityAlertResponse: SecurityAlertResponse = {
      result_type: ResultType.Malicious,
      reason: Reason.notApplicable,
      features: [],
      providerRequestsCount: undefined,
    };

    const result = getBlockaidMetricsParams(securityAlertResponse);
    expect(result).toEqual({
      ui_customizations: ['flagged_as_malicious'],
      security_alert_response: ResultType.Malicious,
      security_alert_reason: Reason.notApplicable,
    });
  });
});