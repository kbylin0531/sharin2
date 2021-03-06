<?php
/*
* @link http://www.kalcaddle.com/
* @author warlee | e-mail:kalcaddle@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kalcaddle.com/tools/licenses/license.txt
*/

//处理成标准目录
function _DIR_CLEAR($path){
    $path = htmlspecial_decode($path);
    $path = str_replace('\\','/',trim($path));
    if (strstr($path,'../')) {//preg耗性能
        $path = preg_replace('/\.+\/+/', '/', $path);
    }
    $path = preg_replace('/\/+/', '/', $path);
    return $path;
}

//处理成用户目录，并且不允许相对目录的请求操作
function _DIR($path){
    $path = _DIR_CLEAR(rawurldecode($path));
    $path = iconv_system($path);
    if (substr($path,0,strlen('*recycle*/')) == '*recycle*/') {
        return USER_RECYCLE.str_replace('*recycle*/','',$path);
    }
    if (substr($path,0,strlen('*public*/')) == '*public*/') {
        return PUBLIC_PATH.str_replace('*public*/','',$path);
    }
    if (substr($path,0,strlen('*share*/')) == '*share*/') {
        return "*share*/";
    }
    $path = HOME.$path;
    if (is_dir($path)) $path = rtrim($path,'/').'/';
    return $path;
}

//处理成用户目录输出
function _DIR_OUT(&$arr){

    if (is_array($arr)) {
        foreach ($arr['filelist'] as $key => $value) {
            $arr['filelist'][$key]['ext'] = htmlspecial($value['ext']);
            $arr['filelist'][$key]['path'] = htmlspecial($value['path']);
            $arr['filelist'][$key]['name'] = htmlspecial($value['name']);
        }
        foreach ($arr['folderlist'] as $key => $value) {
            $arr['folderlist'][$key]['path'] = htmlspecial($value['path']);
            $arr['folderlist'][$key]['name'] = htmlspecial($value['name']);
        }
    }else{
        $arr = htmlspecial($arr);
    }
    if (isset($GLOBALS['is_root'])&&$GLOBALS['is_root']) return;
    if (is_array($arr)) {
        foreach ($arr['filelist'] as $key => $value) {
            $arr['filelist'][$key]['path'] = pre_clear($value['path']);
        }
        foreach ($arr['folderlist'] as $key => $value) {
            $arr['folderlist'][$key]['path'] = pre_clear($value['path']);
        }
    }else{
        $arr = pre_clear($arr);
    }
}
//前缀处理 非root用户目录/从HOME开始
function pre_clear($path){
    if (ST=='share') {
        return str_replace(HOME,'',$path);
    }
    if (substr($path,0,strlen(PUBLIC_PATH)) == PUBLIC_PATH) {
        return '*public*/'.str_replace(PUBLIC_PATH,'',$path);
    }
    if (substr($path,0,strlen(USER_RECYCLE)) == USER_RECYCLE) {
        return '*recycle*/'.str_replace(USER_RECYCLE,'',$path);
    }
    return str_replace(HOME,'',$path);
}
function htmlspecial($str){
    return str_replace(
        array('<','>','"',"'"),
        array('&lt;','&gt;','&quot;','&#039;','&amp;'),
        $str
    );
}
function htmlspecial_decode($str){
    return str_replace(        
        array('&lt;','&gt;','&quot;','&#039;'),
        array('<','>','"',"'"),
        $str
    );
}

//扩展名权限判断
function checkExtUnzip($s,$info){
    return checkExt($info['stored_filename']);
}
//扩展名权限判断 有权限则返回1 不是true
function checkExt($file,$changExt=false){
    if (strstr($file,'<') || strstr($file,'>') || $file=='') {
        return 0;
    }
    if ($GLOBALS['is_root'] == 1) return 1;
    $not_allow = $GLOBALS['auth']['ext_not_allow'];
    $ext_arr = explode('|',$not_allow);
    foreach ($ext_arr as $current) {
        if ($current !== '' && stristr($file,'.'.$current)){//含有扩展名
            return 0;
        }
    }
    return 1;
}


function get_charset(&$str) {
    if ($str == '') return 'utf-8';
    //前面检测成功则，自动忽略后面
    $charset=strtolower(mb_detect_encoding($str,$GLOBALS['config']['check_charset']));
    if (substr($str,0,3)==chr(0xEF).chr(0xBB).chr(0xBF)){
        $charset='utf-8';
    }else if($charset=='cp936'){
        $charset='gbk';
    }
    if ($charset == 'ascii') $charset = 'utf-8';
    return strtolower($charset);
}

function php_env_check(){
    $L = $GLOBALS['L'];
    $error = '';
    $base_path = get_path_this(BASIC_PATH).'/'; 
    if(!function_exists('iconv')) $error.= '<li>'.$L['php_env_error_iconv'].'</li>';
    if(!function_exists('mb_convert_encoding')) $error.= '<li>'.$L['php_env_error_mb_string'].'</li>';
    if(!version_compare(PHP_VERSION,'5.0','>=')) $error.= '<li>'.$L['php_env_error_version'].'</li>';
    if(!function_exists('file_get_contents')) $error.='<li>'.$L['php_env_error_file'].'</li>';
    if(!path_writable(BASIC_PATH)) $error.= '<li>'.$base_path.'	'.$L['php_env_error_path'].'</li>';
    if(!path_writable(BASIC_PATH.'data')) $error.= '<li>'.$base_path.'data	'.$L['php_env_error_path'].'</li>';

    $parent = get_path_father(BASIC_PATH);
	$arr_check = array(
		BASIC_PATH,
		BASIC_PATH.'data',
		BASIC_PATH.'data/system',
		BASIC_PATH.'data/User',
		BASIC_PATH.'data/thumb',
	);
	foreach ($arr_check as $value) {
		if(!path_writable($value)){
			$error.= '<li>'.str_replace($parent,'',$value).'/	'.$L['php_env_error_path'].'</li>';
		}
	}
    if(!function_exists('imagecreatefromjpeg')){
        $error.= '<li>GD-jpeg not found!</li>';
    }
    if(!function_exists('imagecreatefromgif')){
        $error.= '<li>GD-gif not found!</li>';
    }
    if(!function_exists('imagecreatefrompng')){
        $error.= '<li>GD-png not found!</li>';
    }
    if(!function_exists('imagecolorallocate')){
        $error.= '<li>imagecolorallocate not found!</li>';
    }
//    if( !function_exists('imagecreatefromjpeg')||
//        !function_exists('imagecreatefromgif')||
//        !function_exists('imagecreatefrompng')||
//        !function_exists('imagecolorallocate')){
//        $error.= '<li>'.$L['php_env_error_gd'].'</li>';
//    }
    return $error;
}

//登陆是否需要验证码
function need_check_code(){
	if(!function_exists('imagecolorallocate')){
		return false;
	}else{
		return true;
	}
}
function is_wap(){
    return \Sharin\Library\Helper\ClientAgent::isPhone();
}
function user_logout(){
    setcookie('PHPSESSID', '', time()-3600,'/'); 
    setcookie('kod_name', '', time()-3600); 
    setcookie('kod_token', '', time()-3600);
    setcookie('kod_user_language', '', time()-3600);
    session_destroy();
    header('location:./'.ENTRY_FILE.'?user/login');
    exit;
}


