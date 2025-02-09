<?php
/**
 * This script is used to create dynamic albums from a search.
 * @package core
 */
// force UTF-8 Ø

define('OFFSET_PATH', 1);
require_once(dirname(__FILE__) . '/admin-globals.php');
require_once(dirname(__FILE__) . '/template-functions.php');

admin_securityChecks(ALBUM_RIGHTS, $return = currentRelativeURL());

$_zp_admin_imagelist = array();

$search = new SearchEngine(true);
if (isset($_POST['savealbum'])) {
	XSRFdefender('savealbum');
	$albumname = sanitize($_POST['album']);
	if ($album = sanitize($_POST['albumselect'])) {
		$albumobj = AlbumBase::newAlbum($album);
		$allow = $albumobj->isMyItem(ALBUM_RIGHTS);
	} else {
		$allow = zp_loggedin(MANAGE_ALL_ALBUM_RIGHTS);
	}
	if (!$allow) {
		if (!zp_apply_filter('admin_managed_albums_access', false, $return)) {
			zp_error(gettext("You do not have edit rights on this album."));
		}
	}
	if ($_POST['create_tagged'] == 'static') {
		$return_unpublished = isset($_POST['return_unpublished']);
		$words = sanitize($_POST['album_tag']);
		$searchfields[] = 'tags_exact';
		// now tag each element
		if (isset($_POST['return_albums'])) {
			$subalbums = $search->getAlbums(0);
			foreach ($subalbums as $analbum) {
				$albumobj = AlbumBase::newAlbum($analbum);
				if ($return_unpublished || $albumobj->isPublished()) { 
					$tags = array_unique(array_merge($albumobj->getTags(), array($words)));
					$albumobj->setTags($tags);
					$albumobj->setLastChangeUser($_zp_current_admin_obj->getUser());
					$albumobj->save();
				}
			}
		}
		if (isset($_POST['return_images'])) {
			$images = $search->getImages();
			foreach ($images as $animage) {
				$image = Image::newImage(AlbumBase::newAlbum($animage['folder']), $animage['filename']);
				if ($return_unpublished || $image->isPublished()) { 
					$tags = array_unique(array_merge($image->getTags(), array($words)));
					$image->setTags($tags);
					$image->setLastChangeUser($_zp_current_admin_obj->getUser());
					$image->save();
				}
			}
		}
	} else {
		$searchfields = array();
		foreach ($_POST as $key => $value) {
			if (strpos($key, 'SEARCH_') !== false) {
				$searchfields[] = sanitize(str_replace('SEARCH_', '', postIndexDecode($key)));
			}
		}
		$words = sanitize($_POST['search']);

	}
	if (isset($_POST['thumb'])) {
		$thumb = sanitize($_POST['thumb']);
	} else {
		$thumb = '';
	}
	$constraints = "\nCONSTRAINTS=" . 'inalbums=' . ((int) (isset($_POST['return_albums']))) . '&inimages=' . ((int) (isset($_POST['return_images']))) . '&unpublished=' . ((int) (isset($_POST['return_unpublished'])));
	$redirect = $album . '/' . $albumname . '.alb';

	if (!empty($albumname)) {
		$f = fopen(internalToFilesystem(ALBUM_FOLDER_SERVERPATH . $redirect), 'w');
		if ($f !== false) {
			fwrite($f, "WORDS=$words\nTHUMB=$thumb\nFIELDS=" . implode(',', $searchfields) . $constraints . "\n");
			fclose($f);
			clearstatcache();
			// redirct to edit of this album
			redirectURL(FULLWEBPATH . "/" . ZENFOLDER . "/admin-edit.php?page=edit&album=" . pathurlencode($redirect));
		}
	}
}
$_GET['page'] = 'edit'; // pretend to be the edit page.
printAdminHeader('edit', gettext('dynamic'));
echo "\n</head>";
echo "\n<body>";
printLogoAndLinks();
echo "\n" . '<div id="main">';
printTabs();
echo "\n" . '<div id="content">';
zp_apply_filter('admin_note', 'albums', 'dynamic');
echo "<h1>" . gettext("Create Dynamic Album") . "</h1>\n";

if (isset($_POST['savealbum'])) { // we fell through, some kind of error
	echo "<div class=\"errorbox space\">";
	echo "<h2>" . gettext("Failed to save the album file") . "</h2>";
	echo "</div>\n";
}

$albumlist = $_zp_gallery->getAllAlbumsFromDB();
$fields = $search->fieldList;
$albumname = $search->getSearchWords();
$words = $search->codifySearchString();
$images = $search->getImages(0);
foreach ($images as $image) {
	$folder = $image['folder'];
	$filename = $image['filename'];
	$_zp_admin_imagelist[] = '/' . $folder . '/' . $filename;
}
$subalbums = $search->getAlbums(0);
foreach ($subalbums as $folder) {
	getSubalbumImages($folder);
}
$albumname = sanitize_path($albumname);
$albumname = seoFriendly($albumname);
$old = '';
while ($old != $albumname) {
	$old = $albumname;
	$albumname = str_replace('--', '-', $albumname);
}
?>
<form class="dirty-check" action="?savealbum" method="post" autocomplete="off">
	<?php XSRFToken('savealbum'); ?>
	<input type="hidden" name="savealbum" value="yes" />
	<table>
		<tr>
			<td><?php echo gettext("Album name:"); ?></td>
			<td>
				<input type="text" size="40" name="album" value="<?php echo html_encode($albumname) ?>" />
			</td>
		</tr>
		<tr>
			<td><?php echo gettext("Create in:"); ?></td>
			<td>
				<select id="albumselectmenu" name="albumselect">
					<?php
					if (accessAllAlbums(UPLOAD_RIGHTS)) {
						?>
						<option value="" style="font-weight: bold;">/</option>
						<?php
					}
     $parentalbum = '';
    	if(isset($_GET['folder'])) {
     		$parentalbum = sanitize($_GET['folder']);
     }
					foreach ($albumlist as $fullfolder => $albumtitle) {
						$singlefolder = $fullfolder;
						$saprefix = "";
						$salevel = 0;
						// Get rid of the slashes in the subalbum, while also making a subalbum prefix for the menu.
						while (strstr($singlefolder, '/') !== false) {
							$singlefolder = substr(strstr($singlefolder, '/'), 1);
							$saprefix = "–&nbsp;" . $saprefix;
							$salevel++;
						}
      $selected = '';
      if($parentalbum == $fullfolder) {
        $selected = ' selected="selected"';
      }
						echo '<option value="' . $fullfolder . '"'.$selected.'>' . $saprefix . $singlefolder . ' (' . $albumtitle .')' . '</option>\n';
					}
					?>
				</select>
			</td>
		</tr>
		<tr>
			<td><?php echo gettext("Thumbnail:"); ?></td>
			<td>
				<select id="thumb" name="thumb">
					<?php
					$selections = array();
					foreach ($_zp_albumthumb_selector as $key => $selection) {
						$selections[$selection['desc']] = $key;
					}
					generateListFromArray(array(getOption('AlbumThumbSelect')), $selections, false, true);
					$showThumb = $_zp_gallery->getThumbSelectImages();
					foreach ($_zp_admin_imagelist as $imagepath) {
						$pieces = explode('/', $imagepath);
						$filename = array_pop($pieces);
						$folder = implode('/', $pieces);
						$albumx = AlbumBase::newAlbum($folder);
						$image = Image::newImage($albumx, $filename);
						if ($image->isPhoto() || !is_null($image->objectsThumb)) {
							echo "\n<option class=\"thumboption\"";
							if ($showThumb) {
								echo " style=\"background-image: url(" . html_encode($image->getSizedImage(80)) .
								"); background-repeat: no-repeat;\"";
							}
							echo " value=\"" . $imagepath . "\"";
							echo ">" . $image->getTitle();
							echo " ($imagepath)";
							echo "</option>";
						}
					}
					?>
				</select>
			</td>
		</tr>
		<tr>
			<td><?php echo gettext("Search criteria:"); ?></td>
			<td>
				<input type="text" size="60" name="search" value="<?php echo html_encode($words); ?>" />
				<label><input type="checkbox" name="return_albums" value="1"<?php if (!getOption('search_no_albums')) echo ' checked="checked"' ?> /><?php echo gettext('Return albums found') ?></label>
				<label><input type="checkbox" name="return_images" value="1"<?php if (!getOption('search_no_images')) echo ' checked="checked"' ?> /><?php echo gettext('Return images found') ?></label>
				<label><input type="checkbox" name="return_unpublished" value="1" /><?php echo gettext('Return unpublished items') ?></label>
			</td>
		</tr>

		<script type="text/javascript">
			// <!-- <![CDATA[
			function setTagged(state) {
				if (state) {
					$('#album_tag').removeAttr('disabled');
					$('.searchchecklist').attr('disabled', 'disabled');
				} else {
					$('.searchchecklist').removeAttr('disabled');
					$('#album_tag').attr('disabled', 'disabled');
				}
			}
			// ]]> -->
		</script>

		<tr>
			<td>
				<label>
					<input type="radio" name="create_tagged" value="dynamic" onchange="setTagged(false)" checked="checked" /><?php echo gettext('dynamic'); ?>
				</label>
				<label>
					<input type="radio" name="create_tagged" value="static" onchange="setTagged(true)"/><?php echo gettext('tagged'); ?>
				</label>
			</td>
			<td>
			</td>
		</tr>
		<tr>
			<td><?php echo gettext('Album <em>Tag</em>'); ?></td>
			<td>
				<input type="text" size="40" name="album_tag" id="album_tag" value="<?php echo html_encode($albumname); ?>" disabled="disabled" />
				<?php echo gettext('Select <em>tagged</em> to tag the current search results with this <em>tag</em> and use as the album criteria.'); ?>
			</td>
		</tr>
		<tr>
			<td><?php echo gettext("Search fields:"); ?></td>
			<td>
				<?php
				echo '<ul class="searchchecklist">' . "\n";
				$selected_fields = array();
				$engine = new SearchEngine(true);
				$available_fields = $engine->allowedSearchFields();
				if (count($fields) == 0) {
					$selected_fields = $available_fields;
				} else {
					foreach ($available_fields as $display => $key) {
						if (in_array($key, $fields)) {
							$selected_fields[$display] = $key;
						}
					}
				}
				generateUnorderedListFromArray($selected_fields, $available_fields, 'SEARCH_', false, true, true);
				echo '</ul>';
				?>
			</td>
		</tr>

	</table>

	<input type="submit" value="<?php echo addslashes(gettext('Create the album')); ?>" class="button" />
</form>

<?php
echo "\n" . '</div>';
echo "\n" . '</div>';

printAdminFooter();

echo "\n</body>";
echo "\n</html>";
?>

