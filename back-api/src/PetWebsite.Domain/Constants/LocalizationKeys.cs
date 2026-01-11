namespace PetWebsite.Domain.Constants;

/// <summary>
/// Centralized localization keys for strongly-typed access to localized strings.
/// Prevents magic strings and provides compile-time safety.
/// </summary>
public static class LocalizationKeys
{
	/// <summary>
	/// Authentication-related localization keys.
	/// </summary>
	public static class Auth
	{
		public const string EmailRequired = "Auth.EmailRequired";
		public const string InvalidEmail = "Auth.InvalidEmail";
		public const string PasswordRequired = "Auth.PasswordRequired";
		public const string PasswordTooShort = "Auth.PasswordTooShort";
		public const string PasswordRequiresUppercase = "Auth.PasswordRequiresUppercase";
		public const string PasswordRequiresLowercase = "Auth.PasswordRequiresLowercase";
		public const string PasswordRequiresDigit = "Auth.PasswordRequiresDigit";
		public const string PasswordRequiresSpecialChar = "Auth.PasswordRequiresSpecialChar";
		public const string InvalidCredentials = "Auth.InvalidCredentials";
		public const string AccountInactive = "Auth.AccountInactive";
		public const string LoginSuccess = "Auth.LoginSuccess";
		public const string LoginFailed = "Auth.LoginFailed";
		public const string RegisterSuccess = "Auth.RegisterSuccess";
		public const string RegisterFailed = "Auth.RegisterFailed";
		public const string UserAlreadyExists = "Auth.UserAlreadyExists";
		public const string InvalidRefreshToken = "Auth.InvalidRefreshToken";
		public const string TokenRefreshed = "Auth.TokenRefreshed";
		public const string RoleRequired = "Auth.RoleRequired";
		public const string SmsVerificationFailed = "Auth.SmsVerificationFailed";
	}

	/// <summary>
	/// User-related localization keys.
	/// </summary>
	public static class User
	{
		public const string NotFound = "User.NotFound";
		public const string CreateSuccess = "User.CreateSuccess";
		public const string UpdateSuccess = "User.UpdateSuccess";
		public const string DeleteSuccess = "User.DeleteSuccess";
		public const string CannotDeleteLastSuperAdmin = "User.CannotDeleteLastSuperAdmin";
		public const string FirstNameRequired = "User.FirstNameRequired";
		public const string LastNameRequired = "User.LastNameRequired";
		public const string FirstNameMaxLength = "User.FirstNameMaxLength";
		public const string LastNameMaxLength = "User.LastNameMaxLength";
		public const string PhoneNumberRequired = "User.PhoneNumberRequired";
		public const string InvalidPhoneNumber = "User.InvalidPhoneNumber";
		public const string PhoneNumberMaxLength = "User.PhoneNumberMaxLength";
		public const string ProfilePictureUrlMaxLength = "User.ProfilePictureUrlMaxLength";
		public const string PasswordChangedSuccess = "User.PasswordChangedSuccess";
		public const string NewPasswordMustBeDifferent = "User.NewPasswordMustBeDifferent";
		public const string IdInvalid = "User.IdInvalid";
		public const string CreateFailed = "User.CreateFailed";
		public const string UpdateFailed = "User.UpdateFailed";
		public const string DeleteFailed = "User.DeleteFailed";
		public const string RoleAssignFailed = "User.RoleAssignFailed";
	}

	/// <summary>
	/// Role-related localization keys.
	/// </summary>
	public static class Role
	{
		public const string NotFound = "Role.NotFound";
		public const string AlreadyExists = "Role.AlreadyExists";
		public const string CreateSuccess = "Role.CreateSuccess";
		public const string UpdateSuccess = "Role.UpdateSuccess";
		public const string DeleteSuccess = "Role.DeleteSuccess";
		public const string CannotDeleteSystemRole = "Role.CannotDeleteSystemRole";
		public const string NameRequired = "Role.NameRequired";
		public const string NameMaxLength = "Role.NameMaxLength";
		public const string InvalidCharacters = "Role.InvalidCharacters";
		public const string UserAlreadyHasRole = "Role.UserAlreadyHasRole";
		public const string UserDoesNotHaveRole = "Role.UserDoesNotHaveRole";
		public const string AssignSuccess = "Role.AssignSuccess";
		public const string RemoveSuccess = "Role.RemoveSuccess";
		public const string CannotRemoveLastSuperAdmin = "Role.CannotRemoveLastSuperAdmin";
		public const string IdRequired = "Role.IdRequired";
		public const string IdInvalid = "Role.IdInvalid";
		public const string CreateFailed = "Role.CreateFailed";
		public const string UpdateFailed = "Role.UpdateFailed";
		public const string DeleteFailed = "Role.DeleteFailed";
		public const string AssignFailed = "Role.AssignFailed";
		public const string RemoveFailed = "Role.RemoveFailed";
		public const string NameAlreadyExists = "Role.NameAlreadyExists";
	}

	/// <summary>
	/// Pet-related localization keys.
	/// </summary>
	public static class Pet
	{
		public const string NotFound = "Pet.NotFound";
		public const string CreateSuccess = "Pet.CreateSuccess";
		public const string UpdateSuccess = "Pet.UpdateSuccess";
		public const string DeleteSuccess = "Pet.DeleteSuccess";
		public const string NameRequired = "Pet.NameRequired";
		public const string BreedRequired = "Pet.BreedRequired";
		public const string AgeInvalid = "Pet.AgeInvalid";
	}

	/// <summary>
	/// Pet category-related localization keys.
	/// </summary>
	public static class PetCategory
	{
		public const string NotFound = "PetCategory.NotFound";
		public const string CreateSuccess = "PetCategory.CreateSuccess";
		public const string UpdateSuccess = "PetCategory.UpdateSuccess";
		public const string DeleteSuccess = "PetCategory.DeleteSuccess";
		public const string RestoreSuccess = "PetCategory.RestoreSuccess";
		public const string IdInvalid = "PetCategory.IdInvalid";
		public const string LocalizationRequired = "PetCategory.LocalizationRequired";
		public const string LocaleCodeRequired = "PetCategory.LocaleCodeRequired";
		public const string LocaleCodeMaxLength = "PetCategory.LocaleCodeMaxLength";
		public const string TitleRequired = "PetCategory.TitleRequired";
		public const string TitleMaxLength = "PetCategory.TitleMaxLength";
		public const string SubtitleRequired = "PetCategory.SubtitleRequired";
		public const string SubtitleMaxLength = "PetCategory.SubtitleMaxLength";
		public const string SvgIconRequired = "PetCategory.SvgIconRequired";
		public const string IconColorRequired = "PetCategory.IconColorRequired";
		public const string IconColorMaxLength = "PetCategory.IconColorMaxLength";
		public const string BackgroundColorRequired = "PetCategory.BackgroundColorRequired";
		public const string BackgroundColorMaxLength = "PetCategory.BackgroundColorMaxLength";
		public const string DisplayOrderInvalid = "PetCategory.DisplayOrderInvalid";
		public const string DeletedByMaxLength = "PetCategory.DeletedByMaxLength";
		public const string InvalidLocaleCode = "PetCategory.InvalidLocaleCode";
		public const string CannotDeleteWithBreeds = "PetCategory.CannotDeleteWithBreeds";
	}

	/// <summary>
	/// Pet breed-related localization keys.
	/// </summary>
	public static class PetBreed
	{
		public const string NotFound = "PetBreed.NotFound";
		public const string CreateSuccess = "PetBreed.CreateSuccess";
		public const string UpdateSuccess = "PetBreed.UpdateSuccess";
		public const string DeleteSuccess = "PetBreed.DeleteSuccess";
		public const string RestoreSuccess = "PetBreed.RestoreSuccess";
		public const string IdInvalid = "PetBreed.IdInvalid";
		public const string LocalizationRequired = "PetBreed.LocalizationRequired";
		public const string LocaleCodeRequired = "PetBreed.LocaleCodeRequired";
		public const string LocaleCodeMaxLength = "PetBreed.LocaleCodeMaxLength";
		public const string TitleRequired = "PetBreed.TitleRequired";
		public const string TitleMaxLength = "PetBreed.TitleMaxLength";
		public const string CategoryIdInvalid = "PetBreed.CategoryIdInvalid";
		public const string CategoryNotFound = "PetBreed.CategoryNotFound";
		public const string DisplayOrderInvalid = "PetBreed.DisplayOrderInvalid";
		public const string InvalidLocaleCode = "PetBreed.InvalidLocaleCode";
		public const string CannotDeleteWithPetAds = "PetBreed.CannotDeleteWithPetAds";
	}

	/// <summary>
	/// City-related localization keys.
	/// </summary>
	public static class City
	{
		public const string NotFound = "City.NotFound";
		public const string CreateSuccess = "City.CreateSuccess";
		public const string UpdateSuccess = "City.UpdateSuccess";
		public const string DeleteSuccess = "City.DeleteSuccess";
		public const string RestoreSuccess = "City.RestoreSuccess";
		public const string IdInvalid = "City.IdInvalid";
		public const string NameRequired = "City.NameRequired";
		public const string NameMaxLength = "City.NameMaxLength";
		public const string AlreadyExists = "City.AlreadyExists";
		public const string CannotDeleteWithPetAds = "City.CannotDeleteWithPetAds";
	}

	/// <summary>
	/// Pet advertisement-related localization keys.
	/// </summary>
	public static class PetAd
	{
		public const string NotFound = "PetAd.NotFound";
		public const string CreateSuccess = "PetAd.CreateSuccess";
		public const string UpdateSuccess = "PetAd.UpdateSuccess";
		public const string DeleteSuccess = "PetAd.DeleteSuccess";
		public const string PublishSuccess = "PetAd.PublishSuccess";
		public const string UnpublishSuccess = "PetAd.UnpublishSuccess";
		public const string ImageUploadSuccess = "PetAd.ImageUploadSuccess";
		public const string ImageDeleteSuccess = "PetAd.ImageDeleteSuccess";
		public const string ImageNotFound = "PetAd.ImageNotFound";
		public const string ImageAlreadyAttached = "PetAd.ImageAlreadyAttached";
		public const string ImageNotOwnedByUser = "PetAd.ImageNotOwnedByUser";
		public const string ImagesMustBeOwnedByUser = "PetAd.ImagesMustBeOwnedByUser";
		public const string InvalidImageFormat = "PetAd.InvalidImageFormat";
		public const string TitleRequired = "PetAd.TitleRequired";
		public const string TitleMaxLength = "PetAd.TitleMaxLength";
		public const string DescriptionRequired = "PetAd.DescriptionRequired";
		public const string DescriptionMaxLength = "PetAd.DescriptionMaxLength";
		public const string AgeInvalid = "PetAd.AgeInvalid";
		public const string AgeTooHigh = "PetAd.AgeTooHigh";
		public const string GenderRequired = "PetAd.GenderRequired";
		public const string GenderInvalid = "PetAd.GenderInvalid";
		public const string AdTypeRequired = "PetAd.AdTypeRequired";
		public const string AdTypeInvalid = "PetAd.AdTypeInvalid";
		public const string ColorRequired = "PetAd.ColorRequired";
		public const string ColorMaxLength = "PetAd.ColorMaxLength";
		public const string WeightInvalid = "PetAd.WeightInvalid";
		public const string WeightTooHigh = "PetAd.WeightTooHigh";
		public const string SizeInvalid = "PetAd.SizeInvalid";
		public const string PriceInvalid = "PetAd.PriceInvalid";
		public const string PriceTooHigh = "PetAd.PriceTooHigh";
		public const string LocationRequired = "PetAd.LocationRequired";
		public const string LocationMaxLength = "PetAd.LocationMaxLength";
		public const string ContactRequired = "PetAd.ContactRequired";
		public const string ContactPhoneMaxLength = "PetAd.ContactPhoneMaxLength";
		public const string ContactPhoneInvalid = "PetAd.ContactPhoneInvalid";
		public const string ContactEmailMaxLength = "PetAd.ContactEmailMaxLength";
		public const string ContactEmailInvalid = "PetAd.ContactEmailInvalid";
		public const string BreedIdInvalid = "PetAd.BreedIdInvalid";
		public const string BreedNotFound = "PetAd.BreedNotFound";
		public const string CityIdInvalid = "PetAd.CityIdInvalid";
		public const string CityNotFound = "PetAd.CityNotFound";
		public const string TooManyImages = "PetAd.TooManyImages";
		public const string ImageIdInvalid = "PetAd.ImageIdInvalid";
		public const string AlreadyPublished = "PetAd.AlreadyPublished";
		public const string NotPublished = "PetAd.NotPublished";
		public const string IdInvalid = "PetAd.IdInvalid";
		public const string InvalidStatus = "PetAd.InvalidStatus";
		public const string InvalidStatusTransition = "PetAd.InvalidStatusTransition";
		public const string RejectionReasonRequired = "PetAd.RejectionReasonRequired";
		public const string RejectionReasonMaxLength = "PetAd.RejectionReasonMaxLength";
		public const string CannotReviewNonPendingAd = "PetAd.CannotReviewNonPendingAd";
		public const string CannotCloseNonPublishedAd = "PetAd.CannotCloseNonPublishedAd";
		public const string CannotEditPublishedAd = "PetAd.CannotEditPublishedAd";
		public const string CloseSuccess = "PetAd.CloseSuccess";
		public const string CannotAskQuestionOnUnpublishedAd = "PetAd.CannotAskQuestionOnUnpublishedAd";
		public const string CannotAskQuestionOnOwnAd = "PetAd.CannotAskQuestionOnOwnAd";
		public const string QuestionAskedSuccess = "PetAd.QuestionAskedSuccess";
		public const string QuestionNotFound = "PetAd.QuestionNotFound";
		public const string OnlyAdOwnerCanAnswer = "PetAd.OnlyAdOwnerCanAnswer";
		public const string QuestionAlreadyAnswered = "PetAd.QuestionAlreadyAnswered";
		public const string QuestionAnsweredSuccess = "PetAd.QuestionAnsweredSuccess";
		public const string OnlyAdOwnerCanDeleteQuestion = "PetAd.OnlyAdOwnerCanDeleteQuestion";
	}

	/// <summary>
	/// Favorite advertisement-related localization keys.
	/// </summary>
	public static class FavoriteAd
	{
		public const string AlreadyAdded = "FavoriteAd.AlreadyAdded";
		public const string NotFound = "FavoriteAd.NotFound";
		public const string AddSuccess = "FavoriteAd.AddSuccess";
		public const string RemoveSuccess = "FavoriteAd.RemoveSuccess";
	}

	/// <summary>
	/// File-related localization keys.
	/// </summary>
	public static class File
	{
		public const string UploadSuccess = "File.UploadSuccess";
		public const string DownloadSuccess = "File.DownloadSuccess";
		public const string DeleteSuccess = "File.DeleteSuccess";
		public const string NotFound = "File.NotFound";
		public const string TooLarge = "File.TooLarge";
		public const string InvalidExtension = "File.InvalidExtension";
		public const string InvalidPath = "File.InvalidPath";
		public const string ChecksumMismatch = "File.ChecksumMismatch";
		public const string FileNameCannotBeEmpty = "File.NameCannotBeEmpty";
		public const string FileExtensionNotAllowed = "File.ExtensionNotAllowed";
		public const string FileSizeExceedsLimit = "File.SizeExceedsLimit";
		public const string FailedToSaveFile = "File.FailedToSave";
		public const string FileNotFound = "File.NotFound";
		public const string FailedToRetrieveFile = "File.FailedToRetrieve";
		public const string FailedToDeleteFile = "File.FailedToDelete";
		public const string FailedToCalculateChecksum = "File.FailedToCalculateChecksum";
		public const string FailedToVerifyFileIntegrity = "File.FailedToVerifyIntegrity";
		public const string FailedToGetFileMetadata = "File.FailedToGetMetadata";
		public const string AccessToPathDenied = "File.AccessToPathDenied";
		public const string FailedToResolvePath = "File.FailedToResolvePath";
	}

	/// <summary>
	/// Validation-related localization keys.
	/// </summary>
	public static class Validation
	{
		public const string Required = "Validation.Required";
		public const string MaxLength = "Validation.MaxLength";
		public const string MinLength = "Validation.MinLength";
		public const string Range = "Validation.Range";
		public const string EmailFormat = "Validation.EmailFormat";
		public const string UrlFormat = "Validation.UrlFormat";
	}

	/// <summary>
	/// SMS-related localization keys.
	/// </summary>
	public static class Sms
	{
		public const string PhoneNumberRequired = "SMS.PhoneNumberRequired";
		public const string InvalidPhoneNumber = "SMS.InvalidPhoneNumber";
		public const string MessageRequired = "SMS.MessageRequired";
		public const string MessageTooLong = "SMS.MessageTooLong";
		public const string SendSuccess = "SMS.SendSuccess";
		public const string SendFailed = "SMS.SendFailed";
		public const string BalanceCheckFailed = "SMS.BalanceCheckFailed";
		public const string InvalidResponse = "SMS.InvalidResponse";
		public const string NetworkError = "SMS.NetworkError";
		public const string InvalidBody = "SMS.InvalidBody";
		public const string InvalidMsisdn = "SMS.InvalidMsisdn";
		public const string VerificationCodeRequired = "SMS.VerificationCodeRequired";
		public const string InvalidVerificationCode = "SMS.InvalidVerificationCode";
		public const string VerificationCodeExpired = "SMS.VerificationCodeExpired";
		public const string VerificationCodeAlreadyUsed = "SMS.VerificationCodeAlreadyUsed";
		public const string VerificationCodeNotFound = "SMS.VerificationCodeNotFound";
		public const string CodeSent = "SMS.CodeSent";
		public const string TooManyRequests = "SMS.TooManyRequests";
		public const string PurposeRequired = "SMS.PurposeRequired";
		public const string InvalidPurpose = "SMS.InvalidPurpose";
		public const string VerificationFailed = "SMS.VerificationFailed";
	}

	/// <summary>
	/// Error-related localization keys.
	/// </summary>
	public static class Error
	{
		public const string InternalServerError = "Error.InternalServerError";
		public const string Unauthorized = "Error.Unauthorized";
		public const string Forbidden = "Error.Forbidden";
		public const string BadRequest = "Error.BadRequest";
		public const string NotFound = "Error.NotFound";
		public const string InsufficientPermissions = "Error.InsufficientPermissions";
	}

	/// <summary>
	/// Success-related localization keys.
	/// </summary>
	public static class Success
	{
		public const string OperationCompleted = "Success.OperationCompleted";
		public const string DataRetrieved = "Success.DataRetrieved";
		public const string DataSaved = "Success.DataSaved";
		public const string DataDeleted = "Success.DataDeleted";
		public const string ResourceCreated = "Success.ResourceCreated";
	}
}
