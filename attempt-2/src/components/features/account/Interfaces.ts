import { Nullable } from '@/utils/helperTypes';
export interface AccountResponse {
  account: Account;
  meta: Meta;
}

interface Meta {
  status: number;
  free_user: boolean;
  mobile_free: boolean;
  subscription_state: string;
  notification?: SiteNotification | null;
}
interface SiteNotification {
  message: string;
  title: string;
}

export interface Account {
  active_ab_tests: ActiveAbTests;
  alert_me: AlertMe;
  billing_info: BillingInfo;
  legal_doc_info: LegalDocInfo;
  notification?: AccountNotification | null;
  report_tags: ReportTags;
  retention_info: RetentionInfo;
  sandboxed: boolean;
  search_counts: SearchCounts;
  staff_info: StaffInfo;
  subscription_info: SubscriptionInfo;
  upgrade_info: UpgradeInfo;
  user_info: UserInfo;
  user_settings: UserSettings;
}

export interface UserInfo {
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string;
  optout_options: boolean;
  user_code: string;
  optout_deleted: boolean;
  join_date: string;
  signup_type: string;
  design_name: string;
  design_version: string;
  tos_version_bad: boolean;
  pp_version_bad: boolean;
  noncompliant: boolean;
  tos_pending: boolean;
  'shut_down?': boolean;
  hide_person_video: boolean;
  hide_property_video: boolean;
  friends_and_family: boolean;
  user_in_recycling: boolean;
  recycling_date: string | null;
  is_self_searcher: boolean;
  seats: Seat[];
  seat_status: string | null;
  invite_count: number;
  has_connected_vehicles: boolean;
}

export interface SubscriptionInfo {
  free_user: boolean;
  'mobile_free?': boolean;
  public_plan_type: string;
  subscription_plan_unique_name: string;
  subscription_plan_internal_name: string;
  subscription_state: string;
  in_billable_state: boolean;
  recurring: boolean;
  public_price_description: string;
  normalize_date: string;
  monitor_limit: number;
  remaining_monitors: number;
  credits_remaining: number;
  monthly_reports_remaining: number;
  monthly_report_limit: number;
  recycling_reports_remaining: number;
  subscription_features: SubscriptionFeatures;
  money_amount: string;
  'show_unlimited_reports?': boolean;
  renewal_period: number;
  renewal_period_type: string;
}

export type SubscriptionFeatures = Nullable<{
  monthly_report_limit: number;
  consumer_report_block_plan_name: string;
  unlimited_reports: boolean;
  unlimited_monitors: boolean;
  report_tier: string;
  monitor_limit: number;
  daily_report_soft_limit: number;
  monthly_bjl_limit: number;
  comp_reports_enabled: boolean;
  alertme_enabled: boolean;
  unlimited_bankruptcies: boolean;
  unlimited_liens_and_judgments: boolean;
  lien_and_judgment_limit: number;
  six_month_transaction_multiplier: number;
  default_design: string;
  default_search_bar: string;
  modal_family: string;
  bankruptcy_limit: number;
  session_lock_enabled: boolean;
  pdf_access: boolean;
  pro_account: boolean;
  hourly_report_soft_limit: number;
  active_reports_limit: number;
  api_access: boolean;
}>;

export interface SubscriptionPlan {
  amazon_id: string | null;
  amount: number;
  app_only: string;
  apple_id: string | null;
  google_id: string | null;
  name: string;
  title: string;
  subtitle: string;
  recurring: boolean;
  renewal_period: number;
  renewal_period_type: string;
  report_tier: string;
  unique_key: string;
  internal_name: string;
  discount: string | null;
  public_price_description: string;
  default: boolean;
  monthly_report_limit: number;
}

export interface UpgradeInfo {
  upgrade_credits: number;
}

export interface SearchCounts {
  replenishment_date: string;
  allocated_bankruptcies: number;
  allocated_liens_and_judgments: number;
  remaining_bankruptcies: number;
  remaining_liens_and_judgments: number;
}

export interface LegalDocInfo {
  active_tos_version: number;
  active_privacy_policy_version: number;
}

export interface BillingInfo {
  card_type?: string;
  name?: string;
  card_number?: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface AlertMe {
  has_access: boolean;
  settings: AlertMeSettings;
}

export interface AlertMeSettings {
  id: number;
  digest_enabled: boolean;
  push_digest_enabled: boolean;
  instant_enabled: boolean;
  push_instant_enabled: boolean;
  next_digest_mailing_at: string;
  created_at: string;
  updated_at: string;
}

export type RetentionInfo = Nullable<{
  ran_report_on_self: boolean;
  ran_report_on_multiple_days: boolean;
  ran_report_on_family_member: boolean;
  ran_reverse_phone_search: boolean;
  ran_email_search: boolean;
  ran_professional_contact_search: boolean;
  ran_people_search: boolean;
  ran_property_search: boolean;
  ran_estate_value_search: boolean;
  created_monitor: boolean;
  created_monitor_on_self: boolean;
  created_monitor_on_family_member: boolean;
  created_monitor_on_property: boolean;
  created_monitor_on_email: boolean;
  created_monitor_on_their_email: boolean;
  has_used_mobile_app: boolean;
  has_used_website: boolean;
  downsell_plan_offered: boolean;
  downsell_plan_accepted: boolean;
  claimed_person_report: boolean;
  ran_username_search: boolean;
  ran_neighborhood_watch_search: boolean;
  ran_vehicle_search: boolean;
  claimed_report: boolean;
}>;

export type ReportTags = Nullable<{
  self_person_report_id: string;
}>;

export interface ActiveAbTests {
  tests: ActiveAbTest[];
}

export interface ActiveAbTest {
  id: number;
  user_id: number;
  source: string;
  experiment_key: string;
  variation_key: string;
  created_at: string;
  updated_at: string;
  whitelist: string | null;
}
export type UserSettings = Nullable<{
  hide_reactivation_banner: boolean;
  hide_recurring_cancelled_banner: boolean;
  hide_bad_billing_banner: boolean;
  hide_credit_card_banner: boolean;
  hide_trial_welcome_banner: boolean;
  skip_creation_modal: boolean;
  hide_person_video: boolean;
  hide_property_video: boolean;
  hide_dark_web_banner: boolean;
  hide_dark_web_notifications: boolean;
  hide_unclaimed_money_banner: boolean;
  hide_unclaimed_money_ctas: boolean;
  hide_download_app_cta: boolean;
  hide_unclaimed_money_welcome_modal: boolean;
  hide_social_cleanup_cta: boolean;
  show_info_collection_screen: boolean;
  hide_how_bv_works_modal: boolean;
  hide_payment_update_required_modal: boolean;
  hide_onboarding_checklist_modal: boolean;
  show_higher_confidence_data_only: boolean;
  show_sales_tax_notice_modal: boolean;
  hide_rate_app_banner: boolean;
  hide_multi_seats_invite_modal: boolean;
  hide_criminal_records: boolean;
  hide_privacy_cta: boolean;
  hide_ps_vs_biz_modal: boolean;
  hide_own_fcra: boolean;
  hide_own_tos: boolean;
  show_section_learn_more: boolean;
  hide_cancel_downsell_modal: boolean;
  check_marketplace_step: boolean;
  dqs_completed: boolean;
  hide_passes_invite_modal: boolean;
  hide_sitejabber_widget: boolean;
  check_invites_step: boolean;
  check_extension_step: boolean;
  check_reward_1_step: boolean;
  check_reward_2_step: boolean;
  check_reward_3_step: boolean;
  hide_getting_started: boolean;
  high_confidence_toggle: boolean;
  check_list_completed: boolean;
  check_list_skipped: boolean;
  identity_hub_completed: boolean;
  tips_completed: boolean;
  first_report_modal_seen: boolean;
  openbay_callout_modal_seen: boolean;
  credit_hub_enrollment_completed: boolean;
}>;

export interface StaffInfo {
  admin: boolean;
  blacklister: boolean;
  staff: boolean;
  beta_tester: boolean;
}

interface Seat {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
}

export interface AccountNotification {
  type: string;
  title: string;
  message: string;
  call_to_action: string;
}

//Payments
interface ReceiptItem {
  amount: number | string;
  description: string;
  id: number;
  purchaseable_type: string;
  receipt_id: number;
}

export interface Receipt {
  amount: number | string;
  created_at: string;
  id: number;
  method: string;
  items: ReceiptItem[];
}

export interface PaymentMethods {
  active: boolean;
  card_type: string;
  city: string;
  country: string;
  expiration_month: number;
  expiration_year: number;
  email: string;
  first_name: string;
  id: number;
  last_four: string;
  last_name: string;
  masked_card_number: string;
  payer_id: string;
  state: string;
  street1: string;
  payer_status: string;
  postal_code: string;
  description: string;
  braintree_type: string;
  token: string;
  payment_type: string;
}
export interface PaymentImages {
  master: string;
  visa: string;
  american_express: string;
  discover: string;
  genericCreditCard: string;
  paypal: string;
  applePay: string;
  googlePay: string;
  venmo: string;
}
