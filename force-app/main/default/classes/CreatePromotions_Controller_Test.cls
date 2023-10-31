@isTest(SeeAllData=true)
private class CreatePromotions_Controller_Test {
    static testMethod void unitTest1() {
        INFW_TestHelper helper = new INFW_TestHelper();

        Map<String, RecordTypeInfo> aRecordTypes = Schema.SObjectType.Account.getRecordTypeInfosByName();
        Map<String, RecordTypeInfo> pRecordTypes = Schema.SObjectType.Product__c.getRecordTypeInfosByName();
        Map<String, RecordTypeInfo> paRecordTypes = Schema.SObjectType.Promotion_Activity__c.getRecordTypeInfosByName();
        Map<String, RecordTypeInfo> promoRecordTypes = Schema.SObjectType.Promotion__c.getRecordTypeInfosByName();
        Map<String, RecordTypeInfo> pmiRecordTypes = Schema.SObjectType.Promotion_Material_Item__c.getRecordTypeInfosByName();
        Map<String, RecordTypeInfo> pmiaRecordTypes = Schema.SObjectType.PMI_Actual__c.getRecordTypeInfosByName();

        
        String rtAccount = aRecordTypes.get('INR - Outlets').getRecordTypeId();
        String rtWetGoods = pRecordTypes.get('Wet Goods').getRecordTypeId();
        String rtActivity = paRecordTypes.get('INR - Activity').getRecordTypeId();
        String rtPromotion = promoRecordTypes.get('INR-Promotion').getRecordTypeId();
        String rtPMI = pmiRecordTypes.get('INR-Promotion').getRecordTypeId();
        String rtPMIA = pmiaRecordTypes.get('INR-Promotion').getRecordTypeId();


        User user1 = helper.createUser('System Administrator','Test','User', 'India');
        insert user1;

        System.runAs(user1) {

            Market__c market = helper.createMarket('India');
            market.Country_ISO_Code_2__c = 'IN';
            market.Country_ISO_Code_3__c = 'IND';
            market.Maximum_Agreement_Length__c = 5;
            insert market;

            Account account1 = helper.createAccount('Test India Account', market.Id, 'On Premise');
            account1.RecordTypeId = rtAccount;
            account1.Status__c = 'Active';
            account1.Is_Active__c = true;
            account1.ShippingStreet = '8 India Road';
            account1.ShippingCity = 'India';
            account1.ShippingState = '';
            account1.ShippingPostalCode = '1234 5678';
            account1.ShippingCountry = 'India';
            insert account1;

            Brand__c brand = new Brand__c(Name='Brand');
            insert brand;
            
            List<Product__c> products = helper.createProducts(3, 'Wet Goods', market.Id, brand.Id, false);
            for(Product__c p : products) {
                p.Pack_Quantity__c = 12;
                p.Unit_Size__c = 700;
            }
            insert products;
            
            Promotion_Activity__c activity1 = new Promotion_Activity__c();
            activity1.Name = 'Test India Activity 1';
            activity1.RecordTypeId = rtActivity;
            activity1.Begin_Date__c = Date.today();
            activity1.End_Date__c = activity1.Begin_Date__c.addMonths(3);
            activity1.Status__c = 'Approved';
            activity1.Active__c = true;
            activity1.Market__c = market.Id;
            insert activity1;

            Test.startTest();
            
            Map<String, Object> result = CreatePromotions_Controller.getUserDetails();
            System.assertNotEquals(null, result, 'Market retrieved doesnt match');

            List<Promotion_Activity__c> activities = CreatePromotions_Controller.getActivities(market.Id);
            System.assertNotEquals(0, activities.size(), 'Activities not found');

            List<Product__c> availableProducts = CreatePromotions_Controller.getProducts(market.Id, user1.Id, 'On');
            System.assertNotEquals(0, availableProducts.size(), 'number of Products dont match');

            List<Account> availableAccounts = CreatePromotions_Controller.getAccounts(market.Id, user1.Id, 0, 'India', 'India');
            System.assertNotEquals(0, availableAccounts.size(), 'number of Accounts dont match');

            CreatePromotions_Controller.PromotionItemData pid = new CreatePromotions_Controller.PromotionItemData();
            pid.id = null;
            pid.promotionId = null;
            pid.productId = products.get(0).Id;
            pid.plannedQty = 10;
            pid.packQty = 12;
            pid.casesBottles = true;
            pid.plannedRebate = 1.0;

            CreatePromotions_Controller.PromotionData pd = new CreatePromotions_Controller.PromotionData();
            pd.id = null;
            pd.activityId = activity1.Id;
            pd.accountId = account1.Id;
            pd.startDate = '2023-01-01';
            pd.endDate = '2023-03-01';
            pd.originalStartDate = pd.startDate;
            pd.originalEndDate = pd.endDate;
            pd.items = new List<CreatePromotions_Controller.PromotionItemData>();
            pd.items.add(pid);

            CreatePromotions_Controller.PromotionsContainer container = new CreatePromotions_Controller.PromotionsContainer();
            container.activityId = activity1.Id;
            container.activityStartDate = '2023-01-01';
            container.activityEndDate = '2023-03-01';
            container.count = 1;
            container.promotions = new List<CreatePromotions_Controller.PromotionData>();
            container.promotions.add(pd);

            String promotionsString = JSON.serialize(container);
            
            Map<String, Object> createResult = CreatePromotions_Controller.createPromotions(market.Id, market.Name, activity1.Id, 'INR-Promotion', promotionsString);
            System.assertNotEquals(null, createResult.get('promotions'), 'Promotions not created');

            List<Promotion__c> promotions = CreatePromotions_Controller.getPromotions(user1.Id, market.Id, 0, true);
            System.assertNotEquals(0, promotions.size(), 'number of Promotions dont match');

            List<String> promotionIds = new List<String>();
            promotionIds.add(promotions.get(0).Id);

            List<Promotion__c> promotionDetailsList = CreatePromotions_Controller.getPromotionDetails(promotionIds);
            System.assertNotEquals(0, promotionDetailsList.size(), 'Could not find details for promotions');

            Promotion__c thePromotion = promotionDetailsList.get(0);

            CreatePromotions_Controller.PromotionData pd1 = new CreatePromotions_Controller.PromotionData();
            pd1.id = thePromotion.Id;
            pd1.activityId = thePromotion.Promotion_Activity__c;
            pd1.startDate = '2023-01-01';
            pd1.endDate = '2023-03-01';
            pd1.originalStartDate = pd1.startDate;
            pd1.originalEndDate = pd1.endDate;
            pd1.items = new List<CreatePromotions_Controller.PromotionItemData>();
            
            for(Promotion_Material_Item__c pmi : thePromotion.Promotion_Material_Items__r) {
                CreatePromotions_Controller.PromotionItemData pid1 = new CreatePromotions_Controller.PromotionItemData();
                pid1.id = pmi.Id;
                pid1.promotionId = pmi.Promotion__c;
                pid1.plannedQty = pmi.Plan_Volume__c.intValue();
                pid1.items = new List<CreatePromotions_Controller.PromotionPeriodData>();

                pd1.items.add(pid1);
            }

            List<String> pmiIds = new List<String>();
            for(PMI_Actual__c pmia : thePromotion.PMI_Actuals__r) {
                CreatePromotions_Controller.PromotionPeriodData ppd = new CreatePromotions_Controller.PromotionPeriodData();
                ppd.id = pmia.Id;
                ppd.promotionId = pd1.id;
                ppd.pmiId = pmia.Promotion_Material_Item__c;
                ppd.productId = pmia.Product__c;
                ppd.plannedQty = pmia.Planned_Qty_for_Period__c.intValue();

                for(CreatePromotions_Controller.PromotionItemData pid2 : pd1.items) {
                    if (pid2.id == ppd.pmiId) {
                        pid2.items.add(ppd);
                        break;
                    }
                }
            }
            
            container.promotions.clear();
            container.promotions.add(pd1);

            Map<String, Object> updateResult = CreatePromotions_Controller.updatePromotions(container);
            System.assertEquals('SUCCESS', updateResult.get('status'), 'Update method returned an error');

            Promotion_Material_Item__c thePMI = thePromotion.Promotion_Material_Items__r[0];
            Map<String, Object> actualResult = CreatePromotions_Controller.createActual(thePromotion.Promotion_Activity__c, thePromotion.Id, thePMI.Id, thePMI.Product_Custom__c, 12, thePMI.Plan_Rebate__c, true, thePMI.Product_Pack_Qty__c.intValue(), 1);
            Test.stopTest();
        }
    }
}