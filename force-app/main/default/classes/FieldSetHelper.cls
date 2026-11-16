public with sharing class FieldSetHelper {

	static String getLookupName(String crossObjectReference){
	    // would need to think about this more if there are managed packages
	    return crossObjectReference.endsWith('__r') ?
	        crossObjectReference.replace('__r', '__c') :
	        crossObjectReference + 'Id';
	}
	public class Parser{
	    List<String> path;
	    Schema.SObjectType type;
	    public Parser(Schema.FieldSetMember member, Schema.SObjectType type){
	        this.path = member.fieldPath.split('\\.');
	        this.type = type;
	    }
	
	    public Schema.DescribeFieldResult getDescribe(){
	        // could possibly make this recursive
	        while (path.size() > 1){
	            traverse();
	        }
	        return describe(path[0]);
	    }
	
	    void traverse(){
	        if (path.size() == 1) return;
	        String lookupName = getLookupName(path.remove(0));
	        Schema.DescribeFieldResult describe = describe(lookupName);
	        this.type = describe.getReferenceTo()[0];
	        // this would get a lot more hairy if we want to deal with polymorphic lookups properly
	    }
	
	    Schema.DescribeFieldResult describe(String field){
	        return type.getDescribe().fields.getMap().get(field).getDescribe();
	    }
	}

    public static String validateFieldSetName(String objectName, String name, Boolean traverse) {
        if (objectName == null || objectName.length() == 0 || name == null || name.length() == 0) { return null; }
        
        Schema.SObjectType ot = Schema.getGlobalDescribe().get(objectName);
        if (ot == null) { return null; }
        
		Map<String, Schema.FieldSet> fsMap = ot.getDescribe().fieldSets.getMap();
        for(String s : fsMap.keySet()) {
            System.debug('[FieldSetHelper.validate] fsmap.name: ' + s);
        }        
        String fsName = name;
        System.debug('[FieldSetHelper.validate] fsName: ' + fsName);        
        if (fsMap.containsKey(fsName)) { return fsName; }
        
        if (traverse) {
            List<String> parts = fsName.split('_');
            while (parts.size() > 0) {
                parts.remove(parts.size() - 1);
                fsName = '';
                for(String s : parts) {
                    fsName += s + '_';
                }
                fsName = fsName.removeEnd('_');
                System.debug('[FieldSetHelper.validate] fsName: ' + fsName);
                if (fsMap.containsKey(fsName)) { break; } else { fsName = ''; }
            }
        }
        
        if (fsName == '') {
            fsName = 'Default';
        }
	      
        return fsName;
    }    
    public static Schema.FieldSet getFieldSet(String objectName, String name) {
        if (objectName == null || objectName.length() == 0 || name == null || name.length() == 0) { return null; }
        
        Schema.FieldSet fs = null;
        Schema.SObjectType ot = Schema.getGlobalDescribe().get(objectName);
        if (ot != null) {
            Map<String, Schema.FieldSet> fsMap = ot.getDescribe().fieldSets.getMap();
            if (fsMap.containsKey(name)) {
                fs = fsMap.get(name);
            } else if (!name.endsWithIgnoreCase('_rof') && fsMap.containsKey('Default')) {
                fs = fsMap.get('Default');
            }            
        }
        
        return fs;
    }
    
    public static List<Schema.FieldSetMember> getFieldsetFields(String objectName, String name) {
        if (objectName == null || objectName.length() == 0 || name == null || name.length() == 0) { return null; }
        
        List<Schema.FieldSetMember> fsList = new List<Schema.FieldSetMember>();
        Schema.SObjectType ot = Schema.getGlobalDescribe().get(objectName);
        if (ot != null) {
            Map<String, Schema.FieldSet> fsMap = ot.getDescribe().fieldSets.getMap();
            if (fsMap.containsKey(name)) {
                fsList = fsMap.get(name).getFields();
            } else if (!name.endsWithIgnoreCase('_rof') && fsMap.containsKey('Default')) {
                fsList = fsMap.get('Default').getFields();
            }            
        }
        
        return fsList;
        
    }
    
    public static List<String> getFieldSetFieldNames(String objectName, String fieldsetName) {
        if (objectName == null || objectName.length() == 0 || fieldsetName == null || fieldsetName.length() == 0) { return null; }
        
        List<String> fieldnamesList = new List<String>();
        Schema.SObjectType ot = Schema.getGlobalDescribe().get(objectName);
        if (ot != null) {
            try {
                Map<String, Schema.FieldSet> fsMap = ot.getDescribe().fieldSets.getMap();
	            List<Schema.FieldSetMember> fsList;
                if (fsMap.containsKey(fieldsetName)) {
                    fsList = fsMap.get(fieldsetName).getFields();
                } else if (!fieldsetName.endsWithIgnoreCase('_rof') && fsMap.containsKey('Default')) {
                    fsList = fsMap.get('Default').getFields();
                }
                
                if (fsList != null) {
                    for(Schema.FieldSetMember fsm : fsList) {
                        fieldnamesList.add(fsm.getFieldPath());
                    }                    
                }
            }catch(Exception ex) {
             	fieldnamesList = null;   
            }            
        }
        
        return fieldnamesList;
        
    }
    
    public static List<Schema.FieldSet> getFieldSetsWithNameStartingWith(String objectName, String prefix, Set<String> exclude) {
        if (objectName == null || objectName.length() == 0 || prefix == null || prefix.length() == 0) { return null; }
		
        if(exclude == null){
            exclude = new set<String>();
        }
        
		prefix = prefix.toLowerCase();
        
        List<Schema.FieldSet> fsList = new List<Schema.FieldSet>();
        Schema.SObjectType ot = Schema.getGlobalDescribe().get(objectName);
        if (ot != null) {
            for(String ss : exclude) {
                System.debug('[fieldset] ss: ' + ss);
            }
            try {
                Map<String, Schema.FieldSet> fsMap = ot.getDescribe().fieldSets.getMap();
                for(String s : fsMap.keySet()) {
                    System.debug('[fieldset] s: ' + s);
                    if (s.toLowerCase().startsWith(prefix) && !exclude.contains(s.toLowerCase())) {
                        fsList.add(fsMap.get(s));
                    }
                }
                
            }catch(Exception ex) {
                System.debug('[fieldsethelper] exception raised getting field set names. ' + ex.getMessage());
            }
        }
        
        return fsList;        
    }
    
    public static List<FieldSetWrapper> getFieldSetsWithLabelAndIndex(String objectName, String prefix, Set<String> exclude) {
        /**
         * Method to find fieldsets for object starting with prefix
         * 
         * Parameters:
         * objectName:   name of object to query for field sets
         * prefix    :   prefix of field set name
         * exclude   :   list of fieldset names to exclude.
         * 
         */
        System.debug('[fieldsethelper] objectname : ' + objectName + ', prefix: ' + prefix + ', exclude: ' + (exclude == null));
        
        if (objectName == null || objectName.length() == 0 || prefix == null || prefix.length() == 0) { return null; }

        List<FieldSetWrapper> fswList = null;
        List<Schema.FieldSet> fsList = FieldSetHelper.getFieldSetsWithNameStartingWith(objectName, prefix, exclude);
        System.debug('[fieldsethelper] ' + fsList.size() + ' found with prefix ' + prefix);
        if (fsList != null && fsList.size() > 0) {
            fswList = new List<FieldSetWrapper>();
            String label = '';
            Integer index = -1;
            for(Schema.FieldSet fs : fsList) {
                label = fs.getLabel();
                try {
                    index = Integer.valueOf(label.substringAfterLast('_'));                        
	                fswList.add(new FieldSetWrapper(index, fs.getName(), label, fs.getFields()));     
                    System.debug('[fieldsethelper] adding ' + fs.getName() + ' to fswlist');
                }catch(Exception ex) {
                    index = -1;      
                    System.debug('[fieldsethelper] exception: ' + ex.getMessage());              
                }
                
            }
        }
        
        return fswList;        
        
    }
    
}