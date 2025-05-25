/**
 * Test Class:  Create_Quick_Promotion_Action_Test
 */
global class CreateQuickPromotions_BatchController implements Database.Batchable<SObject>, Database.Stateful {
    private String activityId;
    private List<String> accountIds;
    private String notifyOnCompleteEmail;
    private Integer numberOfPromotions = 0;
    private String activityName;

    public CreateQuickPromotions_BatchController(String activityId, String activityName, List<String> accounts, String userName, String userEmail) {
        this.activityId = activityId;
        this.accountIds = accounts;
        this.numberOfPromotions = accounts.size();
        this.notifyOnCompleteEmail = userEmail;
        this.activityName = activityName;
    }

    global Database.QueryLocator start(Database.BatchableContext BC) {
        List<String> theAccountIds = accountIds;
        String query = 'SELECT Id, Name, Market__c, Market_Name__c FROM Account WHERE Id =:theAccountIds';
        return Database.getQueryLocator(query);
    }
    global void execute(Database.BatchableContext BC, List<Account> accounts) {
        try {
        Map<String, Schema.RecordTypeInfo> promotionRecordTypes = Promotion__c.SObjectType.getDescribe().getRecordTypeInfosByDeveloperName();

        String theActivityId = this.activityId;
        Promotion_Activity__c theActivity = [SELECT Id, Name, Begin_Date__c, End_Date__c, Channel__c, Premise__c, Promotion_Type__c,
                                                    Market__c, Market_Name__c,
                                                (SELECT Id, Name, Account__c FROM Promotions__r),
                                                (SELECT Id, Name, Product_NoFilter__c, Price__c, Quantity__c FROM Activity_Products__r)
                                               FROM Promotion_Activity__c 
                                              WHERE Id =:theActivityId];

        System.debug('# of products: ' + theActivity.Activity_Products__r);
        Set<String> existingPromotions = new Set<String>();
        if(theActivity.Promotions__r != null && theActivity.Promotions__r.size() > 0) {
            for(Promotion__c p : theActivity.Promotions__r) {
                existingPromotions.add(p.Account__c);
            }
        }

        System.debug('accounts: ' + accounts);
        List<Promotion__c> promotions = new List<Promotion__c>();
        for(Account a : accounts) {
            Boolean hasPromotion = existingPromotions.contains(a.Id);
            System.debug('processing account ' + a.Id + ',  hasPromotion: ' + hasPromotion);
            if (!hasPromotion) {
                Promotion__c p = new Promotion__c();
                p.Name = (theActivity.Name + ' - ' + a.Name).left(80);
                p.Account__c = a.Id;

                if (theActivity.Market_Name__c == 'Australia') {
                    p.Promotion_Activity_AUD__c = theActivityId;
                    p.AUD_Channel__c = theActivity.Channel__c;
                } else {
                    p.Promotion_Activity__c = theActivityId;
                    p.Channel__c = theActivity.Channel__c;
                }

                p.Promotion_Start_Date__c = theActivity.Begin_Date__c;
                p.Promotion_End_Date__c = theActivity.End_Date__c;
                p.Market_Lookup__c = theActivity.Market__c;
                p.Created_By_System__c = true;
                p.Status__c = 'Planned';
                p.Promotion_Status__c = 'Planned';

                String promotionRecordTypeName = 'Sales Promo';
                if (String.isNotEmpty(theActivity.Promotion_Type__c)) {
                    promotionRecordTypeName = theActivity.Promotion_Type__c;
                }
                if (promotionRecordTypeName == 'Sales Promo') {
                    promotionRecordTypeName = 'Sales Promotion';
                }
                promotionRecordTypeName = promotionRecordTypeName.replaceAll(' ', '_');
                promotionRecordTypeName = promotionRecordTypeName.replaceAll('-', '_');
                System.debug('pomotionRecordTypeName: ' + promotionRecordTypeName);
                if (promotionRecordTypes.containsKey(promotionRecordTypeName)) {
                    p.RecordTypeId = promotionRecordTypes.get(promotionRecordTypeName).getRecordTypeId();
                }

                promotions.add(p);
            }
        }

        if (promotions.size() > 0) {
            insert promotions;
			System.debug('# of products: ' + theActivity.Activity_Products__r == null ? 0 : theActivity.Activity_Products__r.size());
            if (theActivity.Activity_Products__r != null && theActivity.Activity_Products__r.size() > 0) {
                List<Promotion_Material_Item__c> pmiToCreate = new List<Promotion_Material_Item__c>();
                System.debug('# of promotions: ' + promotions.size());
                for(Promotion__c p : promotions) {
                    for(Activity_Product__c ap : theActivity.Activity_Products__r) {
                        Promotion_Material_Item__c pmi = new Promotion_Material_Item__c();
                        pmi.Promotion__c = p.Id;
                        pmi.Activity__c = theActivity.Id;
                        pmi.Product_Custom__c = ap.Product_NoFilter__c;
                        if (ap.Quantity__c != null) {
                            pmi.Quantity__c = ap.Quantity__c;    
                        }
                        if (ap.Price__c != null) {
                            pmi.Sale_Price_Per_Bottle__c = ap.Price__c;
                        }

                        pmiToCreate.add(pmi);
                    }
                }                
                if (pmiToCreate.size() > 0) {
                    insert pmiToCreate;
                }
            }
        }
        }catch(Exception ex) {
            System.debug('exception: ' + ex.getMessage());
        }
    }
    global void finish(Database.BatchableContext BC) {
        AsyncApexJob a = [SELECT Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems, CreatedBy.Email FROM AsyncApexJob WHERE Id =:BC.getJobId()];
      
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] {notifyOnCompleteEmail});
        mail.setSenderDisplayName('Salesforce Batch Process');
        mail.setSubject('Batch Create Quick Promotions for Activity ' + this.activityName);
        String msg = 'Batch job to create ' + numberOfPromotions + ' promotions for activity ' + activityName;
        if (a.NumberOfErrors > 0) {
            msg += ' has completed with ' + a.NumberOfErrors + ' errors';
        } else {
            msg += ' has completed successfully';
        }
        mail.setPlainTextBody(msg);
        
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {mail});

    }
}