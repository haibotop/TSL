export function getSaleDate () {
  return [
    `/merchantCenter/merchantcenter/v1/saleCount`
  ]
}
export function saleInfo (params) {
  return `/merchantCenter/merchantcenter/v1/saleInfo` + params
}

export function getVipMember () {
  return [
    `/om/OperationManagement/v1/TransactionMemberNumber`
  ]
}
export function newMemberStatistic (params) {
  return `/om/OperationManagement/v1/NewMemberStatistic/` + params
}

export function getPageMember (val) {
  switch (val) {
    case 'doneAmount':
      return [
        `/om/OperationManagement/v1/TransactionOrderMoneyPageNumber`
      ]
    case 'doneOrder':
      return [
        `/om/OperationManagement/v1/TransactionOrderPageNumber`
      ]
    case 'percent':
      return [
        `/om/OperationManagement/v1/TransactionOrderMoneyproportionPageNumber`
      ]
    case 'registrations':
      return [
        `/om/OperationManagement/v1/TransactionMemberCreatedNumber`
      ]
    default:
      return [
        `/om/OperationManagement/v1/TransactionMemberNumberPage`
      ]
  }
}
export function memberConsumptionList (params) {
  return `/om/OperationManagement/v1/memberConsumptionList` + params
}
