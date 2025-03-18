public class TransferPromotion_Controller {
	public String returnUrl						{ get; set; }

    public TransferPromotion_Controller(ApexPages.StandardController controller) {
        Map<String,String> pageParams = ApexPages.currentPage().getParameters();
		returnUrl = pageParams.get('retUrl');

    }
}