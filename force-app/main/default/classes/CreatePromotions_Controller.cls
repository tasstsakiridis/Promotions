/**
 * Test Class:  CreatePromotions_Controller_Test
 */
public with sharing class CreatePromotions_Controller {

    public class PromotionPeriodData {
        @AuraEnabled 
        public String id { get; set; }

        @AuraEnabled 
        public String promotionId { get; set; }

        @AuraEnabled
        public String pmiId { get; set; }
        
        @AuraEnabled 
        public String productId { get; set; }

        @AuraEnabled 
        public String period { get; set; }
     
        @AuraEnabled 
        public Boolean casesBottles { get; set; }

        @AuraEnabled 
        public Integer plannedQty { get; set; }

        @AuraEnabled 
        public Integer actualQty { get; set; }

        @AuraEnabled
        public Decimal plannedRebate { get; set; }
        
    }

    public class PromotionItemData {
        @AuraEnabled 
        public String id { get; set; }

        @AuraEnabled 
        public String promotionId { get; set; }

        @AuraEnabled 
        public String productId { get; set; }

        @AuraEnabled 
        public Decimal plannedQty { get; set; }

        @AuraEnabled
        public Decimal plannedRebate { get; set; }
     
        @AuraEnabled 
        public Integer packQty { get; set; }

        @AuraEnabled 
        public Boolean casesBottles { get; set; }

        @AuraEnabled 
        public List<PromotionPeriodData> items { get; set; }
    }
    public class PromotionData {
        @AuraEnabled 
        public String id { get; set; }

        @AuraEnabled 
        public String name { get; set; }

        @AuraEnabled 
        public String activityId { get; set; }

        @AuraEnabled 
        public String accountId { get; set; }

        @AuraEnabled 
        public String startDate { get; set; }

        @AuraEnabled 
        public String endDate { get; set; }

        @AuraEnabled 
        public String originalStartDate { get; set; }

        @AuraEnabled 
        public String originalEndDate { get; set; }

        @AuraEnabled 
        public List<PromotionItemData> items { get; set; }
    }
    public class PromotionsContainer {
        @AuraEnabled 
        public String activityId { get; set; }

        @AuraEnabled 
        public String activityStartDate { get; set; }

        @AuraEnabled 
        public String activityEndDate { get; set; }

        @AuraEnabled 
        public Integer count { get; set; }

        @AuraEnabled
        public List<PromotionData> promotions { get; set; }

    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getUserDetails() {
        Map<String, Object> result = new Map<String, Object>();

        User u = [SELECT Id, Name, Market__c FROM User WHERE Id =:UserInfo.getUserId()];
        String marketName = 'Australia';
        if (String.isNotEmpty(u.Market__c)) {
            marketName = u.Market__c;
        }

        Market__c m = [SELECT Id, Name FROM Market__c WHERE Name =:marketName LIMIT 1];

        bfObjectDescribe obj_Activity = new bfObjectDescribe('Promotion_Activity__c');
        obj_Activity.getDescribe(true, true, false);

        bfObjectDescribe obj_Promotion = new bfObjectDescribe('Promotion__c');
        obj_Promotion.getDescribe(true, true, false);

        bfObjectDescribe obj_Product = new bfObjectDescribe('Product__c');
        obj_Product.getDescribe(true, true, false);

        bfObjectDescribe obj_Account = new bfObjectDescribe('Account');
        obj_Account.getDescribe(true, true, false);
        
        result.put('userId', u.Id);
        result.put('user', u);
        result.put('market', m);
        result.put('objActivity', obj_Activity);
        result.put('objPromotion', obj_Promotion);
        result.put('objProduct', obj_Product);
        result.put('objAccount', obj_Account);

        return result;
    }

    @AuraEnabled(cacheable=true)
    public static List<Promotion_Activity__c> getActivities(String marketId) {
        return [SELECT Id, Name, Channel__c, Begin_Date__c, End_Date__c, Promotion_Type__c, RecordTypeId, RecordTypeName__c
                  FROM Promotion_Activity__c 
                  WHERE Market__c =:marketId
                    AND Active__c = true
                    AND End_Date__c > TODAY];
    }

    @AuraEnabled(cacheable=true)
    public static List<Promotion__c> getPromotions(String userId, String marketId, Integer offset, Boolean myPromotions) {
        System.debug('userId: ' + userId);
        System.debug('marketId: ' + marketId);
        System.debug('offset: ' + offset);
        String soql = 'SELECT Id, Name, CreatedById, Promotion_Activity__c, Account__c, AccountName__c, Channel__c, Promotion_Start_Date__c, Promotion_End_Date__c ';
        soql += 'FROM Promotion__c ';
        soql += 'WHERE Account__r.Market__c =:marketId ';
        if (myPromotions) {
            soql += 'AND CreatedById =:userId ';
        }
        soql += 'ORDER BY CreatedDate DESC ';
        soql += 'LIMIT 200 ';
        soql += 'OFFSET :offset';
        /*
        return [SELECT Id, Name, Promotion_Activity__c, Account__c, Channel__c, Promotion_Start_Date__c, Promotion_End_Date__c,
                    (SELECT Id, Name, Product_Custom__c, Product_Name__c, Plan_Qty__c FROM Promotion_Material_Items__r),
                    (SELECT Id, Name, Promotion__c, Promotion_Material_Item__c, Activity__c, Period__c, 
                            External_Key__c, Act_Qty__c, Planned_Qty_for_Period__c
                        FROM PMI_Actuals__r)
                FROM Promotion__c
                WHERE Account__r.Market__c =:marketId 
                  ORDER BY CreatedDate DESC
                    LIMIT 200
                    OFFSET :offset];
        */

        return Database.query(soql);
    }
    @AuraEnabled
    public static List<Promotion__c> getPromotionDetails(List<String> promotionIds){
        List<Promotion__c> promotions;
        System.debug('promotionIds: ' + promotionIds);
        try {
            promotions = [SELECT Id, Name, Promotion_Activity__c, Account__c, Channel__c, Promotion_Start_Date__c, Promotion_End_Date__c, Number_of_Periods__c,
                            (SELECT Id, Name, Promotion__c, Product_Custom__c, Product_Name__c, Plan_Volume__c, Plan_Rebate__c, Plan_Bottle__c,
                                    Product_Pack_Qty__c, Cases_Bottles__c
                                FROM Promotion_Material_Items__r),
                            (SELECT Id, Name, Promotion__c, Promotion_Material_Item__c, Activity__c, Period__c, External_Key__c,
                                    Product__c, Product_Name__c, Act_Qty__c, Planned_Qty_for_Period__c, Cases_Bottles__c, Actual_Cases_Bottles__c, 
                                    Month_Name__c, Month_Name_Abbrev__c, Year__c, Planned_Rebate_for_Period__c 
                                FROM PMI_Actuals__r)
                            FROM Promotion__c
                            WHERE Id =:promotionIds];

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return promotions;
    }

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(String marketId, String userId, String channel) {
        return [SELECT Id, Name, Pack_Quantity__c, Unit_Size__c, Brand__c, Brand_Name__c, RecordTypeId, RecordType.Name 
                    FROM Product__c 
                    WHERE Market__c =:marketId 
                      AND IsActive__c = true
                      AND (Channel__c =:channel OR Channel__c = 'Both')
                    ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String marketId, String userId, Integer offset) {
        return [SELECT Id, Name, RecordTypeId, RecordType.Name, ShippingStreet, ShippingCity
                  FROM Account
                  WHERE Is_Active__c = true
                    AND Market__c =:marketId
               ORDER BY Name
                  LIMIT 100
                 OFFSET :offset];
    }

    @AuraEnabled
    public static Map<String, Object> createPromotions(String marketId, String marketName, String activityId, String promotionType, String promotionsString){
        Map<String, Schema.RecordTypeInfo> promotionRecordTypes = Promotion__c.SObjectType.getDescribe().getRecordTypeInfosByName();
        Map<String, Schema.RecordTypeInfo> pmiRecordTypes = Promotion_Material_Item__c.SObjectType.getDescribe().getRecordTypeInfosByName();
        Map<String, Schema.RecordTypeInfo> pmiActualRecordTypes = PMI_Actual__c.SObjectType.getDescribe().getRecordTypeInfosByName();

        System.debug('promotionsString: ' + promotionsString);
        Type classType = Type.forName('PromotionsContainer');
        System.debug('classType: ' + classType);
        PromotionsContainer container;
        if (classType == null) {
            container = (PromotionsContainer)JSON.deserialize(promotionsString, PromotionsContainer.class);
        } else {
            container = (PromotionsContainer)JSON.deserialize(promotionsString, classType);
        }
        System.debug('container: ' + container);

        Map<String, Object> result = new Map<String, Object>();

        // Get Promotion record type for market based on activity promotion type
        String rtPromotion = promotionRecordTypes.get('INR-Promotion').getRecordTypeId();
        if (promotionRecordTypes.containsKey(promotionType)) {
            rtPromotion = promotionRecordTypes.get(promotionType).getRecordTypeId();
        }

        // Get Promotion Material Item record type
        String rtPromotionMaterialItem = pmiRecordTypes.get('INR-Promotion').getRecordTypeId();
        if (pmiRecordTypes.containsKey(promotionType)) {
            rtPromotionMaterialItem = pmiRecordTypes.get(promotionType).getRecordTypeId();
        }

        // Get PMI Actual record type
        String rtPMIActual = pmiActualRecordTypes.get('INR-Promotion').getRecordTypeId();
        if (pmiActualRecordTypes.containsKey(promotionType)) {
            rtPMIActual = pmiActualRecordTypes.get(promotionType).getRecordTypeId();
        }

        List<Promotion__c> promotionsToCreate = new List<Promotion__c>();
        Map<String, Promotion__c> dataMap = new Map<String, Promotion__c>();
        Map<String, Integer> promotionPeriodCountMap = new Map<String, Integer>();
        Integer numberOfPeriods = 0;

        System.debug('# of promotions sent from client: ' + container.promotions.size());
        for(PromotionData pd : container.promotions) {
            Promotion__c p = new Promotion__c();
            p.Name = pd.name;
            p.RecordTypeId = rtPromotion;
            p.Promotion_Activity__c = pd.activityId;
            p.Account__c = pd.accountId;
            p.Promotion_Start_Date__c = Date.valueOf(pd.startDate);
            p.Promotion_End_Date__c = Date.valueOf(pd.endDate);  

            promotionsToCreate.add(p);            
        }

        System.debug('# of promotions to create: ' + promotionsToCreate.size());
        if (promotionsToCreate.size() > 0) {
            insert promotionsToCreate;
            result.put('promotions', promotionsToCreate);

            for(Promotion__c p : promotionsToCreate) {
                dataMap.put(p.Promotion_Activity__c + '_' + p.Account__c, p);

                /*
                numberOfPeriods = p.Promotion_Start_Date__c.monthsBetween(p.Promotion_End_Date__c) + 1;
                if (numberOfPeriods == 0) { numberOfPeriods = 1; }
                System.debug('numberOfPeriods for Promotion: ' + p.Id + ' = ' + numberOfPeriods);
                promotionPeriodCountMap.put(p.Id, numberOfPeriods);
                */
            }

            List<Promotion_Material_Item__c> pmiToCreate = new List<Promotion_Material_Item__c>();

            String key = '';
            Decimal cases = 0;
            Integer bottles = 0;
            for(PromotionData pd : container.promotions) {
                key = pd.activityId + '_' + pd.accountId;
                Promotion__c p = dataMap.get(key);

                for(PromotionItemData pid : pd.items) {
                    Promotion_Material_Item__c pmi = new Promotion_Material_Item__c();
                    pmi.Activity__c = p.Promotion_Activity__c;
                    pmi.Promotion__c = p.Id;
                    pmi.RecordTypeId = rtPromotionMaterialItem;
                    pmi.Product_Custom__c = pid.productId;

                    cases = pid.plannedQty;                    
                    bottles = pid.plannedQty.intValue() * pid.packQty;
                    if (pid.casesBottles == true) {
                        cases = pid.plannedQty / pid.packQty;
                        bottles = pid.plannedQty.intValue();
                    }
                    pmi.Plan_Volume__c = cases;
                    pmi.Plan_Bottle__c = bottles;
                    pmi.Cases_Bottles__c = pid.casesBottles == true ? 'Bottles' : 'Cases';
                    pmi.Plan_Rebate__c = pid.plannedRebate;
                    pmiToCreate.add(pmi);

                }
            }

            System.debug('# of pmi to create: ' + pmiToCreate.size());
            if (pmiToCreate.size() > 0) {
                insert pmiToCreate;
                                
                List<PMI_Actual__c> actualsToCreate = new List<PMI_Actual__c>();
                for(Promotion_Material_Item__c pmi : pmiToCreate) {
                    //numberOfPeriods = promotionPeriodCountMap.get(pmi.Promotion__c);
                    //System.debug('[actuals] numberOfPeriods: ' + numberOfPeriods + ' for promotion: ' + pmi.Promotion__c);
                    //for (Integer x = 0; x < numberOfPeriods; x++) {
                        PMI_Actual__c actual = new PMI_Actual__c();
                        actual.Activity__c = pmi.Activity__c;
                        actual.External_Key__c = pmi.Promotion__c + '-' + pmi.Id + '-0';
                        actual.RecordTypeId = rtPMIActual;
                        actual.Period__c = 0;
                        actual.Promotion__c = pmi.Promotion__c;
                        actual.Promotion_Material_Item__c = pmi.Id;
                        actual.Planned_Qty_for_Period__c = pmi.Cases_Bottles__c == 'Cases' ? pmi.Plan_Volume__c : pmi.Plan_Bottle__c;
                        actual.Planned_Rebate_for_Period__c = pmi.Plan_Rebate__c;
                        actual.Actual_Cases_Bottles__c = pmi.Cases_Bottles__c;
                        actualsToCreate.add(actual);

                    //}
                }

                System.debug('# of actuals to create: ' + actualsToCreate.size());
                if (actualsToCreate.size() > 0) {
                    insert actualsToCreate;
                }
                
            }
        }

        return result;
    }

    @AuraEnabled 
    public static Map<String, Object> createActual(String activityId, String promotionId, String pmiId, String productId, Integer planQty, Decimal planRebate, Boolean casesBottles, Integer period) {
        Map<String, Object> result = new Map<String, Object>();

        System.debug('activityId: ' + activityId);
        System.debug('promotionId: ' + promotionId);
        System.debug('pmiId: ' + pmiId);
        System.debug('productId: ' + productId);
        System.debug('planQty: ' + planQty);
        System.debug('planRebate: ' + planRebate);
        System.debug('casesBottles: ' + casesBottles);
        System.debug('period: ' + period);

        try {
            Promotion_Activity__c activity = [SELECT Id, Name, Promotion_Type__c FROM Promotion_Activity__c WHERE Id =:activityId LIMIT 1];

            // Get PMI Actual record type
            Map<String, Schema.RecordTypeInfo> pmiActualRecordTypes = PMI_Actual__c.SObjectType.getDescribe().getRecordTypeInfosByName();
            String rtPMIActual = pmiActualRecordTypes.get('INR-Promotion').getRecordTypeId();
            if (pmiActualRecordTypes.containsKey(activity.Promotion_Type__c)) {
                rtPMIActual = pmiActualRecordTypes.get(activity.Promotion_Type__c).getRecordTypeId();
            }

            PMI_Actual__c pmia = new PMI_Actual__c();
            pmia.RecordTypeId = rtPMIActual;
            pmia.Activity__c = activityId;
            pmia.Promotion__c = promotionId;
            pmia.Promotion_Material_Item__c = pmiId;
            pmia.Planned_Qty_for_Period__c = planQty;
            pmia.Planned_Rebate_for_Period__c = planRebate;
            pmia.Period__c = period;
            pmia.External_Key__c = promotionId + '-' + pmiId + '-' + period;

            insert pmia;

            result.put('status', 'success');
            result.put('record', pmia);
        }catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }

        return result;

    }

    @AuraEnabled 
    public static Map<String, Object> updatePromotions(PromotionsContainer container) {
        Map<String, Object> result = new Map<String, Object>();
        List<PMI_Actual__c> actuals = new List<PMI_Actual__c>();
        List<Promotion_Material_Item__c> pmiToCreate = new List<Promotion_Material_Item__c>();

        Map<String, Schema.RecordTypeInfo> pmiRecordTypes = Promotion_Material_Item__c.SObjectType.getDescribe().getRecordTypeInfosByName();
        Map<String, Schema.RecordTypeInfo> pmiActualRecordTypes = PMI_Actual__c.SObjectType.getDescribe().getRecordTypeInfosByName();

        // Get Promotion Material Item record type
        String rtPromotionMaterialItem = pmiRecordTypes.get('INR-Promotion').getRecordTypeId();

        // Get PMI Actual record type
        String rtPMIActual = pmiActualRecordTypes.get('INR-Promotion').getRecordTypeId();
/*
        System.debug('promotionsString: ' + promotionsString);
        Type classType = Type.forName('PromotionsContainer');
        System.debug('classType: ' + classType);
        PromotionsContainer container;
        if (classType == null) {
            container = (PromotionsContainer)JSON.deserialize(promotionsString, PromotionsContainer.class);
        } else {
            container = (PromotionsContainer)JSON.deserialize(promotionsString, classType);
        }
        System.debug('container: ' + container);
*/
        try {           
            
            for(PromotionData pd : container.promotions) {
                for(PromotionItemData pid : pd.items) {
                    if (pid.id == null) {
                        // Create new Promotion Material Item - Product was added after the promotion was created
                        Promotion_Material_Item__c pmi = new Promotion_Material_Item__c();
                        pmi.Id = null;
                        pmi.RecordTypeId = rtPromotionMaterialItem;
                        pmi.Promotion__c = pd.id;
                        pmi.Activity__c = pd.activityId;
                        pmi.Product_Custom__c = pid.productId;
                        pmi.Plan_Volume__c = 0;
                        pmi.Plan_Rebate__c = 0;

                        pmiToCreate.add(pmi);
                    }

                    for(PromotionPeriodData ppd : pid.items) {
                        PMI_Actual__c pmia = new PMI_Actual__c();
                        pmia.Id = ppd.id;

                        if (ppd.id == null) {
                            pmia.Activity__c = pd.activityId;
                            pmia.Promotion__c = pd.id;
                            pmia.Promotion_Material_Item__c = pid.id;
                            pmia.Period__c = Integer.valueOf(ppd.period);
                            pmia.External_Key__c = pid.productId;
                            pmia.RecordTypeId = rtPMIActual;
                        }
                        pmia.Planned_Qty_for_Period__c = ppd.plannedQty;
                        pmia.Planned_Rebate_for_Period__c = ppd.plannedRebate;
                        pmia.Actual_Cases_Bottles__c = ppd.casesBottles == true ? 'Bottles' : 'Cases';
                        
                        actuals.add(pmia);
                    }
                }
            }

            if (pmiToCreate.size() > 0) {
                insert pmiToCreate;
                for(Promotion_Material_Item__c pmi : pmiToCreate) {
                    System.debug('pmi: ' + pmi);
                }

                for(PMI_Actual__c pmia : actuals) {
                    if (pmia.Id == null && pmia.Promotion_Material_Item__c == null) {
                        for(Promotion_Material_Item__c pmi : pmiToCreate) {
                            if (pmi.Promotion__c == pmia.Promotion__c && pmi.Product_Custom__c == pmia.External_Key__c) {
                                pmia.Promotion_Material_Item__c = pmi.Id;
                                pmia.External_Key__c = pmia.Promotion__c + '-' + pmi.Id + '-' + pmia.Period__c;
                            }
                        }
                    } 

                    System.debug('pmia: ' + pmia);
                }                
            }

            upsert actuals;

            result.put('status', 'SUCCESS');
        }catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }

        return result;
    }
}
