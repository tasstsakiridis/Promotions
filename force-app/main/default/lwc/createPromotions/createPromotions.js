import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import createPromotions from '@salesforce/apex/CreatePromotions_Controller.createPromotions';
import getUserDetails from '@salesforce/apex/CreatePromotions_Controller.getUserDetails';
import getActivities from '@salesforce/apex/CreatePromotions_Controller.getActivities';
import getAccounts from '@salesforce/apex/CreatePromotions_Controller.getAccounts';
import getProducts from '@salesforce/apex/CreatePromotions_Controller.getProducts';
import getPromotions from '@salesforce/apex/CreatePromotions_Controller.getPromotions';
import getPromotionDetails from '@salesforce/apex/CreatePromotions_Controller.getPromotionDetails';
import updatePromotions from '@salesforce/apex/CreatePromotions_Controller.updatePromotions';
import createActual from '@salesforce/apex/CreatePromotions_Controller.createActual';

import LABEL_ACCOUNT from '@salesforce/label/c.Account';
import LABEL_ACCOUNTS from '@salesforce/label/c.Accounts';
import LABEL_ACTIVITY from '@salesforce/label/c.Activity';
import LABEL_ACTIVITY_DETAILS from '@salesforce/label/c.Activity_Details';
import LABEL_ADD from '@salesforce/label/c.Add';
import LABEL_ADDRESS from '@salesforce/label/c.Address';
import LABEL_ADD_SELECTED from '@salesforce/label/c.Add_Selected';
import LABEL_ADD_SELECTED_ACCOUNTS from '@salesforce/label/c.AddSelectedAccounts';
import LABEL_AFTER_END_DATE_ERROR from '@salesforce/label/c.Date_After_EndDate_Error';
import LABEL_ALL from '@salesforce/label/c.All';
import LABEL_ALL_PERIODS_COMPLETED_MSG from '@salesforce/label/c.All_Periods_Completed';
import LABEL_APRIL from '@salesforce/label/c.April';
import LABEL_AUGUST from '@salesforce/label/c.August';
import LABEL_AVAILABLE from '@salesforce/label/c.Available';
import LABEL_BACK from '@salesforce/label/c.Back';
import LABEL_BEFORE_START_DATE_ERROR from '@salesforce/label/c.Date_Before_StartDate_Error';
import LABEL_BOTTLES from '@salesforce/label/c.Bottles';
import LABEL_BRAND from '@salesforce/label/c.Brand';
import LABEL_BRANDS from '@salesforce/label/c.Brands';
import LABEL_BUILD from '@salesforce/label/c.Build_Record';
import LABEL_BUILD_MESSAGE from '@salesforce/label/c.Building_Records';
import LABEL_CANCEL from '@salesforce/label/c.Cancel'
import LABEL_CASES_BOTTLES from '@salesforce/label/c.Cases_Bottles';
import LABEL_CITY from '@salesforce/label/c.City';
import LABEL_CHANNEL from '@salesforce/label/c.Channel';
import LABEL_CLEAR from '@salesforce/label/c.Clear';
import LABEL_COLLAPSE_ALL from '@salesforce/label/c.Collapse_All';
import LABEL_CREATE_NEW from '@salesforce/label/c.CreateNew';
import LABEL_CREATED_SUCCESSFULLY from '@salesforce/label/c.Created_Successfully';
import LABEL_DECEMBER from '@salesforce/label/c.December';
import LABEL_END_DATE from '@salesforce/label/c.End_Date';
import LABEL_EXPAND_ALL from '@salesforce/label/c.Expand_All';
import LABEL_FEBUARY from '@salesforce/label/c.February';
import LABEL_JANUARY from '@salesforce/label/c.January';
import LABEL_JULY from '@salesforce/label/c.July';
import LABEL_JUNE from '@salesforce/label/c.June';
import LABEL_MARCH from '@salesforce/label/c.March';
import LABEL_MAY from '@salesforce/label/c.May';
import LABEL_MY_PROMOTIONS from '@salesforce/label/c.My_Promotions';
import LABEL_NEXT from '@salesforce/label/c.NEXT';
import LABEL_NOVEMBER from '@salesforce/label/c.November';
import LABEL_OCTOBER from '@salesforce/label/c.October';
import LABEL_PACK_QUANTITY from '@salesforce/label/c.PackQty';
import LABEL_PLAN_QTY from '@salesforce/label/c.Plan_Qty';
import LABEL_PREV from '@salesforce/label/c.PrevAbbrev';
import LABEL_PRODUCT from '@salesforce/label/c.Product';
import LABEL_PRODUCTS from '@salesforce/label/c.Products';
import LABEL_PROMOTION from '@salesforce/label/c.Promotion';
import LABEL_PROMOTIONS from '@salesforce/label/c.Promotions';
import LABEL_REBATE from '@salesforce/label/c.Rebate';
import LABEL_RECORDTYPE from '@salesforce/label/c.RecordType';
import LABEL_RECORDTYPES from '@salesforce/label/c.RecordTypes';
import LABEL_REMOVE from '@salesforce/label/c.Remove';
import LABEL_SAVE from '@salesforce/label/c.Save';
import LABEL_SELECT from '@salesforce/label/c.Select';
import LABEL_SELECTED from '@salesforce/label/c.Selected';
import LABEL_SELECT_BRANDS from '@salesforce/label/c.Select_a_Brand';
import LABEL_SELECT_RECORD_TYPE from '@salesforce/label/c.Select_Record_Type';
import LABEL_SELECT_UNIT_SIZE from '@salesforce/label/c.Select_Unit_Size';
import LABEL_SEPTEMBER from '@salesforce/label/c.September';
import LABEL_START_DATE from '@salesforce/label/c.Start_Date';
import LABEL_SUCCESS from '@salesforce/label/c.Success';
import LABEL_SUMMARY from '@salesforce/label/c.Summary';
import LABEL_UNIT_SIZE from '@salesforce/label/c.Unit_Size';
import LABEL_UNIT_SIZES from '@salesforce/label/c.Unit_Sizes';
import LABEL_UPDATE from '@salesforce/label/c.Update';
import LABEL_WARNING from '@salesforce/label/c.Warning_Title';

const ACTIVITY_TABLE_ROW_ACTIONS = [
    { label: LABEL_SELECT, name: 'select' }
];
const ACTIVITY_TABLE_COLUMNS = [
    { label: LABEL_ACTIVITY, fieldName: 'Name' },
    { label: LABEL_START_DATE, fieldName: 'Begin_Date__c' },
    { label: LABEL_END_DATE, fieldName: 'End_Date__c' },
    { label: LABEL_CHANNEL, fieldName: 'Channel__c' },
    { 
        type: 'action',
        typeAttributes: { rowActions: ACTIVITY_TABLE_ROW_ACTIONS }
    }
];

const ACCOUNT_TABLE_COLUMNS = [
    { label: LABEL_ACCOUNT, fieldName: 'Name' },
    { label: LABEL_ADDRESS, fieldName: 'ShippingStreet' },
    { label: LABEL_CITY, fieldName: 'ShippingCity' }
];

const SELECTED_ACCOUNT_TABLE_COLUMNS = [
    { label: LABEL_ACCOUNT, fieldName: 'Name' }
];

const PROMOTION_TABLE_COLUMNS = [
    { label: LABEL_PROMOTION, fieldName: 'Name' },
    { label: LABEL_ACCOUNT, fieldName: 'AccountName__c' },
    { label: LABEL_START_DATE, fieldName: 'Promotion_Start_Date__c', type: 'date' },
    { label: LABEL_END_DATE, fieldName: 'Promotion_End_Date__c', type: 'date' }
];

const PRODUCT_TABLE_COLUMNS = [
    { label: LABEL_PRODUCT, fieldName: 'Name' },
    { label: LABEL_UNIT_SIZE, fieldName: 'Unit_Size__c' },
    { label: LABEL_PACK_QUANTITY, fieldName: 'Pack_Quantity__c' },
    { label: LABEL_BRAND, fieldName: 'Brand_Name__c'}
];
const SELECTED_PRODUCT_TABLE_COLUMNS = [
    { label: LABEL_PRODUCT, fieldName: 'Name' }
];
const PRODUCT_INPUT_COLUMNS = [
    { label: LABEL_PRODUCT, fieldName: 'name' },
    { label: LABEL_BOTTLES, fieldName: 'casesBottles', type: 'boolean', editable: true },
    { label: LABEL_PLAN_QTY, fieldName: 'planQty', type: 'number', editable: true, typeAttributes: { minimumIntegerDigits: 1, maximumFractionDigits: 0 } },
    { label: LABEL_REBATE, fieldName: 'planRebate', type: 'currency', editable: true, typeAttributes: { minimumIntegerDigits: 1, maximumFractionDigits: 2 } },
];
const PRODUCT_UPDATE_ACTIONS = [
    { label: LABEL_CREATE_NEW, name: "create_new" }
]

const PRODUCT_UPDATE_COLUMNS = [
    { label: LABEL_PRODUCT, fieldName: 'productName', label: LABEL_PRODUCT, sortOrder: -2 },
    { label: LABEL_BOTTLES, fieldName: 'casesBottles', type: 'boolean', label: LABEL_CASES_BOTTLES, sortOrder: -1 },
    { label: LABEL_PLAN_QTY, fieldName: 'planQty', type: 'number', editable: true, typeAttributes: { minimumIntegerDigits: 1, maximumFractionDigits: 0 } },
    { label: LABEL_REBATE, fieldName: 'planRebate', type: 'currency', editable: true, typeAttributes: { minimumIntegerDigits: 1, maximumFractionDigits: 2 } },
    { type: 'action', typeAttributes: { rowActions: PRODUCT_UPDATE_ACTIONS }},
];

export default class CreatePromotions extends LightningElement {
    labels ={
        accounts:   { label: 'account', labelPlural: 'accounts', title: 'Select accounts' },
        activity:   { label: 'activity', labelPlural: 'activities', title: LABEL_ACTIVITY_DETAILS },
        add:        { label: LABEL_ADD },
        addSelected: { label: LABEL_ADD_SELECTED },
        all:        { label: LABEL_ALL },
        allPromotions: { label: LABEL_ALL + ' ' + LABEL_PROMOTIONS },
        available:  { label: LABEL_AVAILABLE },
        back:       { label: LABEL_BACK },
        brand:      { label: LABEL_BRAND, labelPlural: LABEL_BRANDS, placeholder: LABEL_SELECT_BRANDS },
        build:      { label: LABEL_BUILD.replace('{0}', LABEL_PROMOTIONS), message: LABEL_BUILD_MESSAGE.replace('{0}', LABEL_PROMOTIONS) },
        cancel:     { label: LABEL_CANCEL },
        channel:    { label: LABEL_CHANNEL },
        cities:     { label: LABEL_CITY },
        clear:      { label: LABEL_CLEAR },
        collapseAll: { label: LABEL_COLLAPSE_ALL },
        createNew:  { label: LABEL_CREATE_NEW },   
        date:       { overflowError: LABEL_AFTER_END_DATE_ERROR, underFlowError: LABEL_BEFORE_START_DATE_ERROR },  
        endDate:    { label: LABEL_END_DATE },
        expandAll:  { label: LABEL_EXPAND_ALL },
        myPromotions: { label: LABEL_MY_PROMOTIONS },   
        next:       { label: LABEL_NEXT },
        prev:       { label: LABEL_PREV },
        products:   { label: 'product', labelPlural: 'products', title: 'Select products' },
        promotion:  { label: 'promotion', labelPlural: 'promotions' },
        recordType: { label: LABEL_RECORDTYPE, labelPlural: LABEL_RECORDTYPES, placeholder: LABEL_SELECT_RECORD_TYPE },
        remove:     { label: LABEL_REMOVE },
        results:    { label: 'Result' },
        save:       { label: LABEL_SAVE },
        selected:   { label: LABEL_SELECTED },
        startDate:  { label: LABEL_START_DATE },
        success:    { label: LABEL_SUCCESS, message: LABEL_CREATED_SUCCESSFULLY},
        summary:    { label: LABEL_SUMMARY, title: LABEL_SUMMARY },
        unitSize:   { label: LABEL_UNIT_SIZE, labelPlural: LABEL_UNIT_SIZES, placeholder: LABEL_SELECT_UNIT_SIZE },
        update:     { label: LABEL_UPDATE },
        warning:    { label: LABEL_WARNING }
    };

    activityColumns = ACTIVITY_TABLE_COLUMNS;
    accountColumns = ACCOUNT_TABLE_COLUMNS;
    selectedAccountColumns = SELECTED_ACCOUNT_TABLE_COLUMNS;
    promotionColumns = PROMOTION_TABLE_COLUMNS;
    productColumns = PRODUCT_TABLE_COLUMNS;
    selectedProductsColumns = SELECTED_PRODUCT_TABLE_COLUMNS;
    productInputColumns = PRODUCT_INPUT_COLUMNS;
    productUpdateColumns = PRODUCT_UPDATE_COLUMNS;

    targetDataTable;
    accountOffsetCount = 0;
    promotionOffsetCount = 0;
    loadMoreAccountStatus;
    loadMorePromotionStatus;

    @api 
    pageNumber = 'activity';

    @api 
    viewtype = 'create';

    currentPage = 1;
    currentStep = 'actions';
    isCreatingNewPeriod = false;

    steps = ['actions','activities','accounts','products','summary','results'];

    get isActionPage() {
        return this.currentStep == 'actions';
    }
    get isActivityPage() {
        return this.currentStep == 'activities';
    }
    get isAccountPage() {
        return this.currentStep == 'accounts';
    }
    get isProductPage() {
        return this.currentStep == 'products';
    }
    get isSummaryPage() {
        return this.currentStep == 'summary';
    }
    get isResultPage() {
        return this.currentStep == 'results';
    }
    get isUpdatePage() {
        return this.currentStep == 'update';
    }
    get showProgressBar() {
        return this.isCreatingNewPromotions;
    }

    get hasPromotions() {
        return this.promotions && this.promotions.length > 0;
    }
    get promotionsSelected() {
        return this.promotionsToUpdate && this.promotionsToUpdate.length > 0;
    }
    get promotionFilterLabel() {
        return this.limitToMyPromotions ? this.labels.allPromotions.label : this.labels.myPromotions.label;
    }

    get userId() {
        return this.user != undefined ? this.user.Id : '';
    }
    get marketId() {
        return this.market != undefined ? this.market.Id : '';
    }    
    get expandAllLabel() {
        return this.isCollapsed ? this.labels.expandAll.label : this.labels.collapseAll.label;
    }

    error;
    user;
    market;

    isWorking = false;
    isGettingActivities = false;
    isGettingAccounts = false;
    isGettingPromotions = false;
    isGettingProducts = false;
    isConnected = false;
    isCreatingNewPromotions = false;
    limitToMyPromotions = false;
    isCollapsed = true;

    plannedAccountData = [];
    draftValues = [];
    expandedRows = [];

    updateProduct;
    updateProductName;
    updatePlanQty;
    updatePlanRebate;
    periods = [];

    /*
    connectedCallback() {
        if (this.isConnected) { return; }

        getUserDetails()
        .then(result => {
            this.user = result.user;
            this.market = result.market;

            getAvailableAccounts();
            getAvailableActivities();
            getAvailableProducts();
        })
        .catch(error => {
            this.error = error;
            this.user = undefined;
            this.market = undefined;
        });
    }
    */
    channel;
    channelOptions;

    /*  Get Data from Server */
    /*  User  */
    @wire(getUserDetails, {})
    wiredUser({error, data}) {
        if (data) {
            console.log('[getUserDetails] result', data);

            this.error = undefined;
            this.user = data.user;
            this.market = data.market;
            //this.objActivity = data.objActivity;
            //this.objPromotion = data.objPromotion;
            //this.objProduct = data.objProduct;
            
            this.labels.activity.label = data.objActivity.label;
            this.labels.activity.labelPlural = data.objActivity.labelPlural;
            this.labels.promotion.label = data.objPromotion.label;
            this.labels.promotion.labelPlural = data.objPromotion.labelPlural;
            this.labels.products.label = data.objProduct.label;
            this.labels.products.labelPlural = data.objProduct.labelPlural;
            this.labels.accounts.label = data.objAccount.label;
            this.labels.accounts.labelPlural = data.objAccount.labelPlural;

            //this.getExistingPromotions();
            this.getAvailableActivities();
            this.getAvailableAccounts();
            this.getAvailableProducts();
        } else if (error) {
            this.error = error;
            this.user = undefined;
            this.market = undefined;            
        }
    }

    /*  Activities  */
    selectedActivity;
    activities;
    activityOptions;
    getAvailableActivities() {
        getActivities({
            marketId: this.market.Id,
            userId: this.user.Id
        })
        .then(result => {
            console.log('[getAvailableActivities] activities', result);
            this.error = undefined;
            this.activities = result;
            this.isGettingActivities = false;
            this.isWorking = this.isGettingAccounts && this.isGettingActivities && this.isGettingProducts && this.isGettingPromotions;
        })
        .catch(error => {
            this.error = error;
            this.activities = undefined;
        });
    }
    
    wiredPromotions;
    allPromotions = [];
    promotions = [];
    promotionsSelected = [];
    promotionsMap = new Map();
    /*  Promotions  */
    @wire(getPromotions, {
        userId: '$userId',
        marketId: '$marketId',
        offset: '$promotionOffsetCount',
        myPromotions: '$limitToMyPromotions'
    })
    wiredGetPromotions(value) {
        this.wiredPromotions = value;
        console.log('[wiredGetPromotions] promotions', value);
        if (value.data) {
            this.error = undefined;
            this.allPromotions = value.data;
            let l = value.data;
            if (this.myPromotionsFilter) {
                l = value.data.filter(p => p.CreatedById == this.user.Id);
            }
            this.promotions = [...l];
            this.isGettingPromotions = false;
            this.isWorking = this.isGettingAccounts && this.isGettingActivities && this.isGettingProducts && this.isGettingPromotions;            
        } else if (value.error) {
            this.error = value.error;
            this.promotions = [];
            this.allPromotions = [];
        }
    }
    loadMorePromotions(event) {
        event.target.isLoading = true;
        this.loadMorePromotionsStatus = 'Loading';
        this.promotionsOffsetCount += 100;
        this.promotionTargetDataTable = event.target;
    }

    getSelectedPromotionDetails() {
        this.isWorking = true;
        console.log('[getSelectedPromotionDetails] promotionsSelected', this.promotionsSelected);
        const selectedPromotionIds = this.promotionsSelected.map(p => p.Id);
        console.log('[getSelectedPromotionDetails] selectedpromotionIds', selectedPromotionIds);
        getPromotionDetails({
            promotionIds: selectedPromotionIds
        })
        .then(result => {
            console.log('[getSelectedPromotionDetails] result', result);
            this.error = undefined;
            this.promotionsDetails = result; 
            this.buildPromotionDataToUpdate();           
        })
        .catch(error => {
            this.error = error;            
        });
    }

    accountNameFilter = '';
    cities = [];
    accounts = [];
    availableAccounts = [];
    selectedAccounts = [];
    accountsToAdd = [];
    accountsToRemove = [];
    /*  Accounts  */
    getAvailableAccounts() {
        console.log('[getAvailableAccounts]');
        getAccounts({
            userId: this.user.Id,
            marketId: this.market.Id,
            offset: this.accountOffsetCount
        })
        .then(result => {
            console.log('[getAvailableAccounts] accounts', result);
            this.accounts = result;
            let accountList = this.availableAccounts;
            
            let accountCities = [];
            try {
                this.accounts.forEach(a => {
                    let city = a.ShippingCity == undefined || a.ShippingCity == '' ? '' : a.ShippingCity;

                    if (accountCities.findIndex(c => c.value == city) < 0) (
                        accountCities.push({'label': city, 'value': city })
                    )
                });
                accountCities.sort(function(a, b) {
                    let x = a.label.toLowerCase();
                    let y = b.label.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0; 
                });
                accountCities.splice(0, 0, { label: this.labels.all.label, value: 'all' });
                this.cities = [...accountCities];

                accountList = accountList.concat(this.accounts);
                
                this.availableAccounts = [...accountList];
                this.isGettingAccounts = false;
                if (this.targetDataTable) {
                    this.targetDataTable.isLoading = false;
                }
                this.isWorking = this.isGettingAccounts && this.isGettingActivities && this.isGettingProducts && this.isGettingPromotions;
            } catch(ex) {
                console.log('[getAccounts] exception', ex);
            }
        })
        .catch(error => {
            this.error = error;
            this.accounts = [];
            this.availableAccounts = [];
        });
    }

    loadMoreAccounts(event) {
        console.log('[loadMoreAccounts] loading more accounts');
        event.target.isLoading = true;
        this.loadMoreAccountStatus = 'Loading';
        this.accountOffsetCount += 100;
        this.targetDataTable = event.target;
        this.getAvailableAccounts();
    }

    brands = [];
    productRecordTypes = [];
    productUnitSizes = [];
    selectedBrand = 'all';
    selectedProduct;
    selectedProductRecordType = 'all';
    selectedProductUnitSize = 'all';
    products;
    availableProducts = [];
    selectedProducts = [];
    productsToAdd = [];
    productsToRemove = [];
    productOptions = [];
    /*  Products  */
    getAvailableProducts() {
        getProducts({
            marketId: this.market.Id,
            userId: this.user.Id
        })
        .then(result => {
            this.products = result;
            this.availableProducts = result;
            this.error = undefined;

            const productBrands = [];
            const recordTypes = [];
            const unitSizes = [];
            try {
                this.products.forEach(p => {
                    let brandName = p.Brand_Name__c;
                    if (p.Brand_Name__c == undefined || p.Brand_Name__c == '') {
                        brandName = 'unknown';
                    }
                    if (productBrands.findIndex(pb => pb.value == p.Brand__c) < 0) {
                        productBrands.push({ 'label': brandName, 'value': p.Brand__c });
                    }

                    if (recordTypes.findIndex(prt => prt.value == p.RecordTypeId) < 0) {
                        recordTypes.push({ 'label': p.RecordType.Name, 'value': p.RecordTypeId });
                    }

                    let unitSize = p.Unit_Size__c;
                    if (p.Unit_Size__c == undefined || p.Unit_Size__c == '') {
                        unitSize = '';
                    }
                    if (unitSizes.findIndex(u => u.value == unitSize) < 0) {
                        unitSizes.push({ 'label': unitSize, 'value': unitSize.toString() });
                    }

                    this.productOptions.push({ label: p.Name, value: p.Id});
                });

                this.productOptions.sort(function(a, b) {
                    let x = a.label.toLowerCase();
                    let y = b.label.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0; 
                });
                productBrands.sort(function(a, b) {
                    let x = a.label.toLowerCase();
                    let y = b.label.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0; 
                });
                productBrands.splice(0, 0, {'label':this.labels.all.label, 'value':'all'});

                recordTypes.sort(function(a, b) {
                    let x = a.label;
                    let y = b.label;
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0; 
                });
                recordTypes.splice(0, 0, {'label':this.labels.all.label, 'value':'all'});
                unitSizes.sort(function(a, b) {
                    let x = a.label;
                    let y = b.label;
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0; 
                });
                unitSizes.splice(0, 0, {'label':this.labels.all.label, 'value':'all'});

                this.brands = [...productBrands];
                this.productUnitSizes = [...unitSizes];
                this.productRecordTypes = [...recordTypes];
                console.log('[products] products', this.products);
                console.log('brands', this.brands);

            } catch(ex) {
                console.log('[getProducts] exception', ex);
            }
            this.isGettingProducts = true;
            this.isWorking = this.isGettingAccounts && this.isGettingActivities && this.isGettingProducts && this.isGettingPromotions;
        })
        .catch(error => {
            this.error = error;
            this.products = undefined;
        });
    }


    cancel() {
        this.initialise();
    }

    handleCreateNewClick() {
        this.isCreatingNewPromotions = true;
        this.moveToNextPage();
    }
    handleUpdatePromotionsClick() {
        this.isCreatingNewPromotions = false;
        this.getSelectedPromotionDetails();
    }    
    moveToPreviousPage() {
        this.currentPage--;
        this.currentStep = this.steps[this.currentPage-1];
    }
    moveToNextPage() {
        this.currentPage++;
        this.currentStep = this.steps[this.currentPage-1];
        if (this.currentStep == 'summary') {
            this.buildPlannedAccountData();
        }
        if (this.currentStep == 'results') {
            console.log('plannedAccountData', this.plannedAccountData);
        }
    }
    togglePromotionFilter(event) {
        this.limitToMyPromotions = !this.limitToMyPromotions;
        this.promotions = [];

        let l = this.allPromotions;
        if (this.limitToMyPromotions) {
            l = this.allPromotions.filter(p => p.CreatedById == this.user.Id);
        }

        console.log('[togglePromotionFilter] limitToMyPromotions', this.limitToMyPromotions);
        console.log('[togglePromotionFilter] l', l);
        this.promotions = [...l];
    }
    handleActivityRowAction(event) {
        try {
            const actionName = event.detail.action.name;
            const row = event.detail.row;
            console.log('[handleActivityRowAction] actionName', actionName);
            console.log('[handleActivityRowAction] row', row);
            if (actionName == 'select') {
                this.isWorking = true;

                this.selectedActivity = row;
                console.log('[handleActivityRowAction] selecedActivity', JSON.parse(JSON.stringify(row)));
                //this.getExistingPromotionsAndAccounts();
            }
        }catch(ex) {
            console.log('[handleActivityRowAction] exception', ex);            
        }
    }
    handleActivitySelected(event) {
        try {
        console.log('[handleActivitySelected] target', event.currentTarget);
        console.log('[handleActivitySelected] target.attributes', JSON.parse(JSON.stringify(event.currentTarget.dataset)));
            if (event.currentTarget.dataset.key){
                console.log('[handleActivitySelected] key', event.currentTarget.dataset.key);
                const key = event.currentTarget.dataset.key;
                this.selectedActivity = this.activities.find(a => a.Id == key);
                this.moveToNextPage();
            }
        } catch(ex) {
            console.log('[handleActivitySelected] exception', ex);  
        }
    }

    handleAddSelectedAccountsClick(event) {
        this.selectedAccounts = this.selectedAccounts.concat(this.accountsToAdd);
        this.availableAccounts = this.availableAccounts.filter(a => this.selectedAccounts.findIndex(sa => sa.Id == a.Id) < 0);
        console.log('[handleAvailableAccountSelected] availableAccounts', this.availableAccounts);
        this.accountsToAdd = [];
    }

    handlePromotionStartDateChange(event) {
        console.log('[handlePromotionStartDateChange] dataset.promotionId', event.target.dataset.promotion);
        console.log('[handlePromotionStartDateChange] activity.beginDate', this.selectedActivity.Begin_Date__c);
        console.log('[handlePromotionStartDateChange] new start date', event.detail.value);
        if (event.detail.value < this.selectedActivity.Begin_Date__c) {
            this.showToast("warning", this.labels.warning.label, LABEL_BEFORE_START_DATE_ERROR);
            return;
        }

        const promotionId = event.target.dataset.promotion;
        let promotion;
        if (this.isCreatingNewPromotions) {
            promotion = this.plannedAccountData.find(p => p.id == promotionId);
        } else {
            promotion = this.promotionsToUpdate.find(p => p.id = promotionId);
        }
        if (promotion) {
            promotion.startDate = event.detail.value;
        }

        console.log('[handlePromotionStartDateChange] promotions', this.promotionsToUpdate);
    }
    handlePromotionEndDateChange(event) {
        console.log('[handlePromotionEndDateChange] dataset.promotionId', event.target.dataset.promotion);
        const promotionId = event.target.dataset.promotion;
        //let tmp = this.plannedAccountData;
        let promotion = this.plannedAccountData.find(p => p.id == promotionId);
        let endDate = event.detail.value;
        if (event.detail.value > this.selectedActivity.End_Date__c) {
            this.showToast("warning", this.labels.warning.label, LABEL_AFTER_END_DATE_ERROR);            
            endDate = this.selectedActivity.End_Date__c;
        }

        if (promotion) {
            promotion.endDate = endDate;
        }
        //this.plannedAccountData = [...tmp];
        console.log('[handlePromotionEndDateChange] plannedAccountData', this.plannedAccountData);
    }

    handleAddProductChange(event) {        
        this.selectedProduct = event.detail.value;
        console.log('[handleAddProductChange] selectedproduct', this.selectedProduct);
    }
    handleAddProductToPromotion(event) {
        try {
            const promotionId = event.target.dataset.promotion;
            console.log('[handleAddProductToPromotion] promotionId', promotionId);
            if (this.selectedProduct == undefined || this.selectedProduct == null) {
                console.log('[handleAddProductToPromotion] no product selected');
            } else {
                const productId = this.selectedProduct;
                console.log('[handleAddProductToPromotion] products', this.products);
                console.log('[handleAddProductToPromotion] selectedProduct', productId);
                let product = this.products.find(prd => prd.Id == productId);
                console.log('[handleAddProductToPromotion] product', product);
                const tmp = [...this.promotionsToUpdate];
                let promotion = tmp.find(p => p.id == promotionId);
                console.log('[handleAddProductToPromotion] promotion', promotion);
                if (promotion) {
                    const pmia = {
                        "id": promotionId + '-' + product.Id,
                        "promotionId": promotionId,
                        "pmiId": null,
                        "productId": product.Id,
                        "productName": product.Name,
                        "casesBottles": false,
                        "packQty": product.Pack_Quantity__c == undefined ? 1 : product.Pack_Quantity__c,
                        "planRebate": 0,
                        "periods": [],
                        "isNew": false
                    };
                    promotion.periods.forEach(prd => {
                        pmia.periods.push({"period":prd.period, "pmiaId":null});
                        pmia["planQty:"+prd.period] = 0;
                        pmia["planRebate:"+prd.period] = 0;

                    });
                    promotion.products.push(pmia);

                    this.promotionsToUpdate = [...tmp];
                    this.currentStep = '';
                    setTimeout(() => {
                        this.currentStep = 'update';
                    }, 300);
                }
                
            }
            this.selectedproduct = undefined;
            console.log('[hanelAddProductToPromotion] promotions', this.promotionsToUpdate);
        }catch(ex) {
            console.log('[handleAddProductToPromotion] exception', ex);
        }
    }
    handleAddProductToAllPromotions(event) {
        if (this.selectedProduct == undefined || this.selectedProduct == null) {
            console.log('[handleAddProductToPromotion] no product selected');
        } else {
            try {
                const productId = this.selectedProduct;
                console.log('[handleAddProductToAllPromotions] products', this.products);
                console.log('[handleAddProductToAllPromotions] selectedProduct', productId);
                let product = this.products.find(prd => prd.Id == productId);
                console.log('[handleAddProductToPromotion] product', product);            
                const tmp = [...this.promotionsToUpdate];
                tmp.forEach(p => {
                    const pmia = {
                        "id": p.id + '-' + product.Id,
                        "promotionId": p.id,
                        "pmiId": null,
                        "productId": product.Id,
                        "productName": product.Name,
                        "casesBottles": false,
                        "packQty": product.Pack_Quantity__c == undefined ? 1 : product.Pack_Quantity__c,
                        "planRebate": 0,
                        "periods": [],
                        "isNew": false
                    };
                    p.periods.forEach(prd => {
                        pmia.periods.push({"period":prd.period, "pmiaId":null});
                        pmia["planQty:"+prd.period] = 0;
                        pmia["planRebate:"+prd.period] = 0;
                    });
                    p.products.push(pmia);
                });
                this.promotionsToUpdate = [...tmp];            
                this.currentStep = '';
                setTimeout(() => {
                    this.currentStep = 'update';
                }, 300);

                this.selectedProduct = undefined;
                console.log('[handleAddProductToAllPromotions] promotionsToUpdate', this.promotionsToUpdate);
            }catch(ex) {
                console.log('[handleAddProductToAllPromotions] exception', ex);
            }
        }
    }
    handlePromotionSelected(event) {
        console.log('[handlePromotionSelected]');
        try {
            this.promotionsSelected = event.detail.selectedRows;
        }catch(ex) {
            console.log('[handlePromotionSelected] exception', ex);
        }
    }

    handleAvailableAccountsSelected(event) {
        this.accountsToAdd = event.detail.selectedRows;
        console.log('[handleAvailableAccountSelected] selectedAccounts', this.selectedAccounts);
    }
    handleSelectedAccountsSelection(event) {
        this.accountsToRemove = event.detail.selectedRows;
    }

    handleRemoveSelectedAccountsClick(event) {
        console.log('[handleRemoveSelectedAccountsClick] accountsToRemove', this.accountsToRemove);
        let accountsList = this.accounts;
        try {
            this.selectedAccounts = this.selectedAccounts.filter(a => this.accountsToRemove.findIndex(ra => ra.Id == a.Id) < 0);
            accountsList = this.accounts.filter(a => this.selectedAccounts.findIndex(sa => sa.Id == a.Id) < 0);
            this.availableAccounts = [...accountsList];
            console.log('[handleRemoveSelectedAccountsClick] selectedAccounts', this.selectedAccounts);
            console.log('[handleRemoveSelectedAccountsClick] accountsList', accountsList);
            console.log('[handleRemoveSelectedAccountsClick] availableAccounts', this.availableAccounts);
        }catch(ex) {
            console.log('[handleRemoveSelectedAccountsClick] exception', ex);
        }
    }
    handleClearSelectedAccountsClick(event) {
        this.availableAccounts = this.accounts;
        this.selectedAccounts = [];
    }

    handleAvailableProductsSelection(event) {
        this.productsToAdd = event.detail.selectedRows;
    }
    handleSelectedProductsSelection(event) {
        this.productsToRemove = event.detail.selectedRows;
    }
    handleAddSelectedProductsClick(event) {
        console.log('[handleAddSelectedProductsClick]');
        try {
            this.selectedProducts = this.selectedProducts.concat(this.productsToAdd);
            console.log('[handleAddSelectedProductsClick] selectedProducts', this.selectedProducts);
        }catch(ex) {
            console.log('[handleAddSelectedProductsClick] exception', ex);
        }
    }
    handleRemoveSelectedProductsClick(event) {
        try {
            this.selectedProducts = this.selectedProducts.filter(p => this.productsToRemove.findIndex(rp => rp.Id == p.Id) < 0);
            const productsList = this.products.filter(p => this.selectedProducts.findIndex(sp => sp.Id == p.Id) < 0);
            this.availableProducts = [...productsList];            
        }catch(ex) {
            console.log('[handleRemoveSelectedProductsClick] exception', ex);
        }
    }
    handleClearSelectedProductsClick(event) {
        this.availableProducts = this.products;
        this.selectedProducts = [];
    }

    initialise() {
        this.availableAccounts = [...this.accounts];
        this.availableProducts = [...this.products];
        this.selectedAccounts = [];
        this.selectedProducts = [];
        this.accountsToAdd = [];
        this.productsToAdd = [];
        this.accountsToRemove = [];
        this.productsToRemove = [];
        this.plannedAccountData = [];
        this.isCreatingNewPromotions = false;

        this.currentPage = 1;
        this.currentStep = this.steps[0];
    }

    buildPlannedAccountData() {
        let data = [];
        this.selectedAccounts.forEach(a => {
            let account = {
                "id": a.Id,
                "name": a.Name,
                "account": a,
                "startDate": this.selectedActivity.Begin_Date__c,
                "endDate": this.selectedActivity.End_Date__c,
                "activityBeginDate": this.selectedActivity.Begin_Date__c,
                "activityEndDate": this.selectedActivity.End_Date__c,
                "products": []
            };

            this.selectedProducts.forEach(p => {
                account.products.push({
                    "id": a.Id+"-"+p.Id,
                    "productId": p.Id,
                    "name": p.Name,
                    "casesBottles": false,
                    "planQty": 0,
                    "planRebate": 0,
                    "product": p
                });
            });

            data.push(account);
        });

        this.plannedAccountData = [...data];
    }
    getPeriodName(periodDate, periodIndex) {
        const d = new Date(periodDate);
        d.setMonth(d.getMonth() + periodIndex);
        let m = d.getMonth();
        let periodName = '';
        console.log('[getPeriodName] d', d);
        console.log('[getPeriodName] m', m);
        switch (m) {
            case 0:
                periodName = LABEL_JANUARY;
                break;
            case 1:
                periodName = LABEL_FEBUARY;
                break;
            case 2:
                periodName = LABEL_MARCH;
                break;
            case 3:
                periodName = LABEL_APRIL;
                break;
            case 4:
                periodName = LABEL_MAY;
                break;
            case 5:
                periodName = LABEL_JUNE;
                break;
            case 6:
                periodName = LABEL_JULY;
                break;
            case 7:
                periodName = LABEL_AUGUST;
                break;
            case 8:
                periodName = LABEL_SEPTEMBER;
                break;
            case 9:
                periodName = LABEL_OCTOBER;
                break;
            case 10:
                periodName = LABEL_NOVEMBER;
                break;
            case 11:
                periodName = LABEL_DECEMBER;
                break;
            default:            
        }

        console.log('[getPeriodName] periodName', periodName);
        return periodName + ', ' + d.getFullYear();
    }
    buildPromotionDataToUpdate() {
        try {
            let data = [];
            console.log('[buildPromotionDataToUpdate] promotionsDetails', this.promotionsDetails);
            let periods = [];
            let expandedRows = [];
            this.promotionsDetails.forEach(p => {
                let promotion = {
                    "id": p.Id,
                    "name": p.Name,
                    "accountId": p.Account__c,
                    "activityId": p.Promotion_Activity__c,
                    "startDate": p.Promotion_Start_Date__c,
                    "endDate": p.Promotion_End_Date__c,
                    "originalStartDate": p.Promotion_Start_Date__c,
                    "originalEndDate": p.Promotion_End_Date__c,
                    "columns": PRODUCT_UPDATE_COLUMNS,
                    "completedPeriods": [],
                    "periods": [],
                    "products": []
                };
                
                console.log('[buildPromotionDataToUpdate] promotion', promotion);
                p.PMI_Actuals__r.forEach(pmia => {
                    if (promotion.completedPeriods.indexOf(pmia.Period__c) < 0) {
                        promotion.completedPeriods.push(pmia.Period__c);
                    }

                    expandedRows.push(pmia.Id);
                    let pmi = promotion.products.find(prod => prod.id == pmia.Promotion_Material_Item__c);
                    if (pmi == undefined) {
                        pmi = {
                            "id" : pmia.Promotion_Material_Item__c,
                            "pmiId": pmia.Promotion_Material_Item__c,
                            "activityId": pmia.Activity__c,
                            "promotionId": pmia.Promotion__c,                        
                            "productName": pmia.Product_Name__c,
                            "productId": pmia.Product__c,
                            "casesBottles": pmia.Cases_Bottles__c == 'Bottles',
                            "planQty": '',
                            "planRebate": '',
                            "completedPeriods": [],
                            "periods": [],
                            "_children": []
                        };                    

                        promotion.products.push(pmi);
                        /*
                        pmia = {
                            "id": pmi.Promotion__c + '-' + pmi.Promotion_Material_Item__c,
                            "pmiaId": pmi.Id,
                            "promotionId": pmi.Promotion__c,
                            "pmiId": pmi.Promotion_Material_Item__c,
                            "productName": pmi.Product_Name__c,
                            "casesBottles": pmi.Cases_Bottles__c == 'Bottles',
                            "period": pmi.Month_Name__c + ', ' + pmi.Year__c,                        
                            "planQty": pmi.Planned_Qty_for_Period__c,
                            "planRebate": pmi
                            "periods": [],
                        };
                        promotion.products.push(pmia);
                        */
                    }

                    if (pmi.completedPeriods.indexOf(pmia.Period__c) < 0) {
                        pmi.completedPeriods.push(pmia.Period__c);                    
                    }

                    pmi._children.push({
                        "id": pmia.Id,
                        "activityId": pmia.Activity__c,
                        "promotionId": pmia.Promotion__c,
                        "pmiId": pmia.Promotion_Material_Item__c,
                        "productName": pmia.Month_Name__c + ',' + pmia.Year__c,
                        "productId": pmia.Product__c,
                        "casesBottles": pmia.Cases_Bottles__c == 'Bottles',
                        "planQty": pmia.Planned_Qty_for_Period__c,
                        "planRebate": pmia.Planned_Rebate_for_Period__c
                    });
                    
                    //pmia["planQty:"+pmi.Period__c] = pmi.Planned_Qty_for_Period__c;
                    //pmia["planRebate:"+pmi.Period__c] = pmi.Planned_Rebate_for_Period__c;
                    //pmia.periods.push({ "period":pmi.Period__c, "pmiaId":pmi.Id });

                    /*
                    if (periods.findIndex(period => period.period == pmi.Period__c) < 0) {
                        periods.push({"period": pmi.Period__c, "pmiaId":pmi.Id});                    
                        promotion.columns.push({label: pmi.Month_Name_Abbrev__c + ',' + pmi.Year__c + '-Qty', fieldName: "planQty:"+pmi.Period__c, editable: true, sortOrder: pmi.Period__c});
                        promotion.columns.push({label: pmi.Month_Name_Abbrev__c + ',' + pmi.Year__c + '-Rebate', fieldName: "planRebate:"+pmi.Period__c, editable: true, sortOrder: pmi.Period__c});
                    }
                    */
                });

                let period = '';
                for(var i = 0; i < p.Number_of_Periods__c; i++) {
                    for(var j = 0; j < promotion.products.length; j++) {
                        if (promotion.products[j].completedPeriods.indexOf(i) < 0) {
                            period = this.getPeriodName(p.Promotion_Start_Date__c, i);
                            promotion.products[j].periods.push({label: period, value: i.toString() });
                        }
                    }
                }

                /*
                promotion.columns.sort(function(a, b) {
                    //if (a.fieldName == 'productName' || b.fieldName == 'productName') { return 1; }
                    let x = a.sortOrder;
                    let y = b.sortOrder;
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0; 
                });
                */
                //promotion.columns.push({ type: 'action', typeAttributes: { rowActions: PRODUCT_UPDATE_ACTIONS }});
                data.push(promotion);
            
            });

            this.promotionsToUpdate = [...data];
            this.expandedRows = [...expandedRows];
            console.log('[buildPromotionsToUpdate] promotionsToUpdate', this.promotionsToUpdate);
            this.isWorking = false;
            this.currentStep = "update";
            this.viewtype = 'update';
        }catch(ex) {
            console.log('[buildPromotionsToUpdate] exception', ex);
        }
    }

    handleExpandAllTreeGrids(event) {
        const grids = this.template.querySelectorAll('lightning-tree-grid');
        if (this.isCollapsed) {
            for(var i = 0; i < grids.length; i++) {
                grids[i].expandAll();
            }
        } else {
            for(var i = 0; i < grids.length; i++) {
                grids[i].collapseAll();
            }
        }
        this.isCollapsed = !this.isCollapsed;
    }
    handleUpdateRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log('[handleUpdateRowAction] actionName', actionName);
        console.log('[handleUpdateRowAction] row', JSON.stringify(row));
        let pmi = row;
        let promotion = this.promotionsToUpdate.find(p => p.promotionId = row.promotionId);
        console.log('[handleUpdateRowAction] pmi', pmi);
        console.log('[handleUpdateRowAction] promotion', promotion);
        console.log('[handleUpdateRowAction] row.level', row.level);
        if (row.level == 2) {
            pmi = promotion.products.find(p => p.pmiId == row.pmiId);            
        }
        console.log('[handleUpdateRowAction] pmi', pmi);
        try {
            switch(actionName) {
                case 'create_new':
                    if (pmi.periods == undefined || pmi.periods.length == 0) {
                        this.showToast('warning', this.labels.warning.label, LABEL_ALL_PERIODS_COMPLETED_MSG);
                        return;
                    }

                    this.updateProduct = pmi;
                    this.updateProductName = pmi.productName;
                    this.updatePlanQty = 0;
                    this.updatePlanRebate = 0;
                    this.periods = [...pmi.periods];
                    this.isCreatingNewPeriod = true;                
                    break;

                default:
            }
        }catch(ex) {
            console.log('[handleUpdateRowAction] exception', ex);
        }
    }

    handlePeriodChange(event) {
        this.selectedPeriod = event.detail.value;
    }
    handleUpdatePlanQtyChange(event) {
        this.updatePlanQty = event.detail.value;
    }
    handleUpdatePlanRebateChange(event) {
        this.updatePlanRebate = event.detail.value;
    }
    cancelNewPeriod() {
        this.updateProduct = undefined;
        this.updateProductName = undefined;
        this.updatePlanQty = 0;
        this.updatePlanRebate = 0;
        this.periods = [];
        this.isCreatingNewPeriod = false;
    }
    createNewActual() {   
        console.log('[createNewActual] updateProduct', this.updateProduct);     
        createActual({
            activityId: this.updateProduct.activityId,
            promotionId: this.updateProduct.promotionId,
            pmiId: this.updateProduct.pmiId,
            productId: this.updateProduct.productId,
            planQty: this.updatePlanQty,
            planRebate: this.updatePlanRebate,
            casesBottles: this.updateProduct.casesBottles,
            period: this.selectedPeriod
        })
        .then(result => {
            console.log('[createActual] result', result);
            let promotion = this.promotionsToUpdate.find(p => p.id == result.record.Promotion__c);
            let product = promotion.products.find(p => p.pmiId == result.record.Promotion_Material_Item__c);
            product._children.push({
                "id": result.record.Id,
                "promotion": result.record.Promotion__c,
                "pmiId": result.record.Promotion_Material_Item__c,
                "productName": this.getPeriodName(promotion.startDate, result.record.Period__c),
                "productId": result.record.Product__c,
                "casesBottles": result.record.Cases_Bottles__c == 'Bottles',
                "planQty": result.record.Planned_Qty_for_Period__c,
                "planRebate": result.record.Planned_Rebate_for_Period__c
            });

            const idx = product.periods.findIndex(p => p.value == result.record.Period__c);
            product.periods.splice(idx, 1);
            this.cancelNewPeriod();

            const grid = this.template.querySelector('lightning-tree-grid');
            grid.collapseAll();
            grid.expandAll();
        })
        .catch(error => {
            console.log('[createNewActual] error', error);
            this.error = error;
        })
    }

    handleAccountProductQtyChange(event) {
        console.log('[handleAccountProductQtyChange] event.target', event.target);
        console.log('[handleAccountProductQtyChange] target.dataset', event.target.dataset);
        console.log('[handleAccountProductQtyChange] target.dataset.accountid', event.target.dataset.account);
        console.log('[handleAccountProductQtyChange] target.dataset.productid', event.target.dataset.productId);
        console.log('[handleAccountProductQtyChange] target.value', event.target.value);
    }

    handlePlannedQtySave(event) {
        console.log('[onsave] draftValues', event.detail.draftValues);
        try {
            event.detail.draftValues.forEach(v => {
                if (this.isCreatingNewPromotions) {
                    const ids = v.id.split('-');
                    const accountId = ids[0];
                    const productId = ids[1];
                    console.log('[onsave] accountid', accountId);
                    console.log('[onsave] productId', productId);
                    const account = this.plannedAccountData.find(a => a.id == accountId);
                    console.log('[onsave] account', account);
                    const product = account.products.find(p => p.productId == productId);
                    console.log('[onsave] product', product);
                    product.planQty = parseInt(v.planQty);
                    product.casesBottles = v.casesBottles == undefined ? false : v.casesBottles;
                    product.planRebate = parseFloat(v.planRebate);

                } else {
                    let period = 0;
                    let planQty = 0;
                    let planRebate = 0;
                    for(const k in v) {
                        if (k.startsWith("planQty")) {
                            period = k.split(":")[1];
                            planQty = parseInt(v[k]);
                        }
                        if (k.startsWith("planRebate")) {
                            period = k.split(":")[1];
                            planRebate = parseInt(v[k]);
                        }
                    }
                    const ids = v.id.split('-');
                    const promotionId = ids[0];
                    const pmiId = ids[1];
                    console.log('[onsave] ids', ids);
                    console.log('[onsave] promotionId', promotionId);
                    console.log('[onsave] pmiId', pmiId);
                    const promotion = this.promotionsToUpdate.find(p => p.id == promotionId);
                    console.log('[onsave] promotion', promotion);
                    let product = promotion.products.find(p => p.pmiId == pmiId);
                    console.log('[onsave.pmi] product', product);
                    if (product == undefined) {
                        product = promotion.products.find(p => p.productId == pmiId);
                        console.log('[onsave.product] product', product);
                    }
                    product['planQty:'+period] = planQty;
                    product['planRebate:'+period] = planRebate;
                }
            });
            this.draftValues = [];
            console.log('[onsave] plannedAccountData', this.plannedAccountData);
            console.log('[onsave] promotionsToUpdate', this.promotionsToUpdate);
        }catch(ex) {
            console.log('[onsave] exception', ex);
        }
    }
    handlePlannedQtyCancel(event) {
        this.draftValues = [];
    }
    handlePlannedQtyCellChange(event) {
        console.log('[oncellchange] draftvalues', event.detail.draftValues);
    }

    handleBrandChange(event) {
        this.selectedBrand = event.detail.value;
        this.filterProducts();
    }
    handleProductRecordTypeChange(event) {
        this.selectedProductRecordType = event.detail.value;
        this.filterProducts();
    }
    handleProductUnitSizeChange(event) {
        this.selectedProductUnitSize = event.detail.value;
        this.filterProducts();
    }

    filterProducts() {
        console.log('[filterProducts] selectedBrand', this.selectedBrand);
        console.log('[filterProducts] selectedRecordType', this.selectedProductRecordType);
        console.log('[filterProducts] selectedUnitSize', this.selectedProductUnitSize);
        let filteredProducts = [...this.products];
        if (this.selectedBrand != 'all') {
            filteredProducts = this.products.filter(p => p.Brand__c == this.selectedBrand);
        }
        if (this.selectedProductRecordType != 'all') {
            filteredProducts = filteredProducts.filter(p => p.RecordTypeId == this.selectedProductRecordType);
        }
        if (this.selectedProductUnitSize != 'all') {
            filteredProducts = filteredProducts.filter(p => p.Unit_Size__c == this.selectedProductUnitSize);
        }
            
        console.log('[filterProducts] filteredProducts', filteredProducts);
        this.availableProducts = [...filteredProducts];
    }

    handleAccountNameFilterChange(event) {
        this.accountNameFilter = event.detail.value;
        this.filterAccounts();
    }
    handleAccountCityChange(event) {
        this.selectedCity = event.detail.value;
        this.filterAccounts();
    }

    filterAccounts() {
        if (this.accountNameFilter == '' && this.selectedCity == 'all') {
            this.availableAccounts = this.accounts;
        } else {
            this.availableAccounts = this.accounts.filter(a => {
                let showAccount = true;
                if (this.accountNameFilter != '') {
                    showAccount = a.Name.toLowerCase().indexOf(this.accountNameFilter.toLowerCase()) > -1;
                }
                if (showAccount && this.selectedCity != 'all') {
                    showAccount = a.ShippingCity == this.selectedCity;
                }

                return showAccount;
            });
        }
    }

    buildPromotions(event) {
        this.isWorking = true;
        if (this.isCreatingNewPromotions) {
            this.createPromotionsService();
        } else {
            this.updatePromotions();
        }
    }
    createPromotionsService() {        
        const promotions = [];   
        console.log('[createPromotionsService] plannedAccountData', this.plannedAccountData);     
        this.plannedAccountData.forEach(pad => {
            let name = pad.account.Name;
            if ((name + '_' + this.selectedActivity.Name).length > 80) {
                name = pad.account.Name.substring(0, 50) + '_' + this.selectedActivity.Name.substring(0, 30);
            }
            let promotion = {
                id: null,
                name: name,
                activityId: this.selectedActivity.Id,
                accountId: pad.account.Id,
                startDate: pad.startDate,
                endDate: pad.endDate,
                items: []
            };

            pad.products.forEach(prod => {

                promotion.items.push({
                    id: null,
                    promotionId: null,
                    productId: prod.productId,
                    plannedQty: prod.planQty,
                    plannedRebate: prod.planRebate,
                    casesBottles: prod.casesBottles,
                    packQty: prod.product.Pack_Quantity__c == undefined ? 1 : prod.product.Pack_Quantity__c,
                    items: []
                });
            });

            promotions.push(promotion);
        });

        const container = {
            'activityId': this.selectedActivity.Id,
            'activityStartDate': this.selectedActivity.Begin_Date__c,
            'activityEndDate': this.selectedActivity.End_Date__c,
            'count': promotions.length,
            'promotions': promotions
        };

        console.log('[createPromotionsService] promotions', promotions);
        console.log('[createPromotionsService] promotionContainer', container);
        console.log('[createPromotionsService] marketId', this.marketId, this.market.Name);
        console.log('[createPromotionsService] activity', this.selectedActivity);
        createPromotions({
            'marketId': this.market.Id,
            'marketName': this.market.Name,
            'activityId': this.selectedActivity.Id,
            'promotionType': this.selectedActivity.Promotion_Type__c,
            'promotionsString': JSON.stringify(container)
        })
        .then(result => {
            this.error = undefined;
            console.log('[createPromotions] result', result);
            
            let msg = this.labels.success.message.replace('{0}', this.labels.promotion.labelPlural);
            if (result == null || result.promotions == undefined || result.promotions == null) {
                msg = ' 0 ' + msg;
            } else {
                msg = result.promotions.length + ' ' + msg;                
            }
            this.showToast("success", this.labels.success.label, msg);
            this.initialise();

            this.promotionOffsetCount = 0;
            //this.getExistingPromotions();
            refreshApex(this.wiredPromotions);
        })
        .catch(error => {
            this.error = error;
            console.log('[createPromotions] exception', error);
        });
    }

    updatePromotions() {
        this.isWorking = true;
        const promotions = [];
        try {
            this.promotionsToUpdate.forEach(p => {
                let promotion = {
                    id: p.id,
                    name: p.name,
                    activityId: p.activityId,
                    accountId: p.accountId,
                    startDate: p.startDate,
                    endDate: p.endDate,
                    originalStartDate: p.originalStartDate,
                    originalEndDate: p.originalEndDate,
                    items: []
                };
                p.products.forEach(prod => {
                    const pmi = {
                        id: prod.pmiId,
                        promotionId: p.id,
                        productId: prod.productId,
                        planedQty: 0,
                        items: []
                    };

                    prod.periods.forEach(period => {                        
                        const pmia = {
                            id: period.pmiaId,
                            promotionId: p.id,
                            pmiId: pmi.id,
                            productId: prod.productId,
                            period: period.period,
                            plannedQty: parseInt(prod["planQty:"+period.period]),
                            actualQty: 0
                        };

                        pmi.items.push(pmia);
                    });

                    promotion.items.push(pmi);
                });

                promotions.push(promotion);
            });
        }catch(ex) {
            console.log('[updatePromotions] exception', ex);            
        }
        const container = {
            'activityId': '',
            'activityStartDate': '',
            'activityEndDate': '',
            'count': promotions.length,
            'promotions': promotions
        };

        console.log('[updatePromotions] promotions', promotions);
        
        updatePromotions({
            'container': container
        })
        .then(result => {
            this.error = undefined;
            console.log('[updatePromotions] result', result);
            let msg = this.labels.success.message.replace('{0}', this.labels.promotion.labelPlural);
            if (result == null || result.promotions == undefined || result.promotions == null) {
                msg = ' 0 ' + msg;
            } else {
                msg = result.promotions.length + ' ' + msg;                
            }
            this.showToast("success", this.labels.success.label, msg);
            this.initialise();

            this.promotionOffsetCount = 0;    
            this.isWorking = false;        
        })
        .catch(error => {
            this.error = error;
            console.log('[updatePromotions] exception', error);
        });
    }

    showToast(type, title, message) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: type
        });

        this.dispatchEvent(toastEvent);
    }
}