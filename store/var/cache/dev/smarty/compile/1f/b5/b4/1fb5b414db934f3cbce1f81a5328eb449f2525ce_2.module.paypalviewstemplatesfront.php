<?php
/* Smarty version 4.2.1, created on 2023-03-31 10:26:30
  from 'module:paypalviewstemplatesfront' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.2.1',
  'unifunc' => 'content_64269936e25011_53078997',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '1fb5b414db934f3cbce1f81a5328eb449f2525ce' => 
    array (
      0 => 'module:paypalviewstemplatesfront',
      1 => 1678782956,
      2 => 'module',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_64269936e25011_53078997 (Smarty_Internal_Template $_smarty_tpl) {
?><!-- begin /home/sexthera/public_html/muizenmesh.co.za/store/modules/paypal/views/templates/front/prefetch.tpl -->
<?php if ((isset($_smarty_tpl->tpl_vars['resources']->value)) && is_array($_smarty_tpl->tpl_vars['resources']->value) && empty($_smarty_tpl->tpl_vars['resources']->value) == false) {?>
    <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['resources']->value, 'resource');
$_smarty_tpl->tpl_vars['resource']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['resource']->value) {
$_smarty_tpl->tpl_vars['resource']->do_else = false;
?>
      <link href="<?php echo htmlspecialchars((string) addslashes($_smarty_tpl->tpl_vars['resource']->value), ENT_QUOTES, 'UTF-8');?>
" rel="prefetch" as="script">
    <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);
}?>

<!-- end /home/sexthera/public_html/muizenmesh.co.za/store/modules/paypal/views/templates/front/prefetch.tpl --><?php }
}
